import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import { z } from "zod";

import type { Database } from "@/types/supabase";

type ClubRow = Database["public"]["Tables"]["club"]["Row"];
type MemberRow = Database["public"]["Tables"]["members"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export type DashboardClub = ClubRow & {
  owner: Pick<ProfileRow, "id" | "full_name" | "email" | "role"> | null;
};

export type MemberStats = {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  clubAgeDays: number;
};

export type RecentMember = Pick<
  MemberRow,
  "id" | "first_name" | "last_name" | "email" | "created_at"
>;

export type RecentActivity = {
  id: string;
  action: string;
  description: string;
  created_at: string | null;
};

const userIdSchema = z.string().uuid();
const clubIdSchema = z.string().uuid();

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not configured`);
  }

  return value;
}

function createDashboardAuthClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getRequiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Server components cannot mutate cookies; server actions can.
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: "", ...options, maxAge: 0 });
          } catch {
            // Server components cannot mutate cookies; server actions can.
          }
        },
      },
    }
  );
}

function createDashboardAdminClient() {
  return createClient<Database>(
    getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

export async function requireDashboardUser(): Promise<User> {
  const supabase = createDashboardAuthClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  return user;
}

async function getCurrentUserClubId(
  supabase: SupabaseClient<Database>,
  userId: string
) {
  const parsedUserId = userIdSchema.parse(userId);
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("club_id")
    .eq("id", parsedUserId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return profile?.club_id ?? null;
}

export async function getClubForUser(userId: string): Promise<DashboardClub | null> {
  const supabase = createDashboardAdminClient();
  const clubId = await getCurrentUserClubId(supabase, userId);

  if (!clubId) {
    return null;
  }

  const parsedClubId = clubIdSchema.parse(clubId);
  const { data: club, error: clubError } = await supabase
    .from("club")
    .select("*")
    .eq("id", parsedClubId)
    .maybeSingle();

  if (clubError) {
    throw new Error(clubError.message);
  }

  if (!club) {
    return null;
  }

  const { data: ownerProfile, error: ownerError } = await supabase
    .from("profiles")
    .select("id, full_name, email, role")
    .eq("club_id", parsedClubId)
    .eq("is_owner", true)
    .maybeSingle();

  if (ownerError) {
    throw new Error(ownerError.message);
  }

  return {
    ...club,
    owner: ownerProfile ?? null,
  };
}

async function getCount(
  supabase: SupabaseClient<Database>,
  clubId: string,
  active?: boolean
) {
  let query = supabase
    .from("members")
    .select("id", { count: "exact", head: true })
    .eq("club_id", clubId);

  if (typeof active === "boolean") {
    query = query.eq("active", active);
  }

  const { count, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}

export async function getMemberStats(
  clubId: string,
  createdAt?: string | null
): Promise<MemberStats> {
  const parsedClubId = clubIdSchema.parse(clubId);
  const supabase = createDashboardAdminClient();
  const [totalMembers, activeMembers, inactiveMembers] = await Promise.all([
    getCount(supabase, parsedClubId),
    getCount(supabase, parsedClubId, true),
    getCount(supabase, parsedClubId, false),
  ]);
  const createdDate = createdAt ? new Date(createdAt) : null;
  const clubAgeDays =
    createdDate && !Number.isNaN(createdDate.getTime())
      ? Math.max(
          0,
          Math.floor((Date.now() - createdDate.getTime()) / 86_400_000)
        )
      : 0;

  return {
    totalMembers,
    activeMembers,
    inactiveMembers,
    clubAgeDays,
  };
}

export async function getRecentMembers(clubId: string): Promise<RecentMember[]> {
  const parsedClubId = clubIdSchema.parse(clubId);
  const supabase = createDashboardAdminClient();
  const { data, error } = await supabase
    .from("members")
    .select("id, first_name, last_name, email, created_at")
    .eq("club_id", parsedClubId)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getRecentActivity(clubId: string): Promise<RecentActivity[]> {
  const recentMembers = await getRecentMembers(clubId);

  return recentMembers.map((member) => ({
    id: `member-${member.id}`,
    action: "member_created",
    description: `${member.first_name} ${member.last_name} was added to the club.`,
    created_at: member.created_at,
  }));
}
