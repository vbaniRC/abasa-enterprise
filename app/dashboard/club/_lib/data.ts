import "server-only";

import type { SupabaseClient, User } from "@supabase/supabase-js";

import { createSupabaseAdminClient } from "@/lib/supabase/server";

import { requireDashboardUser } from "./server";
import type { Club, MemberProfile, Profile } from "./types";

const PROFILE_SELECT = "*";

function normalizeProfile(profile: Profile): Profile {
  return {
    ...profile,
    full_name: profile.full_name ?? null,
    role: profile.role ?? null,
    club_id: profile.club_id ?? null,
    email: profile.email ?? null,
    status: profile.status ?? profile.additional_data?.status ?? null,
    joined_at: profile.joined_at ?? profile.created_at ?? null,
  };
}

async function withAuthEmails<T extends Profile>(
  supabase: SupabaseClient,
  profiles: T[]
): Promise<T[]> {
  const hydrated = await Promise.all(
    profiles.map(async (profile) => {
      if (profile.email) {
        return normalizeProfile(profile) as T;
      }

      const { data } = await supabase.auth.admin.getUserById(profile.id);

      return normalizeProfile({
        ...profile,
        email: data.user?.email ?? null,
      }) as T;
    })
  );

  return hydrated;
}

export async function getOwnedClub(
  supabase: SupabaseClient,
  userId: string
): Promise<Club | null> {
  const { data, error } = await supabase
    .from("clubs")
    .select("*")
    .eq("owner_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as Club | null;
}

export async function getClubContext(): Promise<{
  user: User;
  supabase: SupabaseClient;
  club: Club | null;
  owner: Profile | null;
}> {
  const user = await requireDashboardUser();
  const supabase = createSupabaseAdminClient();
  const club = await getOwnedClub(supabase, user.id);

  if (!club) {
    return { user, supabase, club: null, owner: null };
  }

  const { data: ownerProfile } = await supabase
    .from("profiles")
    .select(PROFILE_SELECT)
    .eq("id", club.owner_id)
    .maybeSingle();

  const [owner] = await withAuthEmails(
    supabase,
    ownerProfile
      ? [{ ...(ownerProfile as Profile), email: user.email ?? null }]
      : [
          {
            id: user.id,
            full_name: user.user_metadata?.full_name ?? null,
            role: "owner",
            club_id: club.id,
            email: user.email ?? null,
          },
        ]
  );

  return { user, supabase, club, owner };
}

export async function getClubCoaches(
  supabase: SupabaseClient,
  clubId: string
): Promise<Profile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_SELECT)
    .eq("club_id", clubId)
    .eq("role", "coach")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return withAuthEmails(supabase, (data ?? []) as Profile[]);
}

export async function getClubMembers(
  supabase: SupabaseClient,
  clubId: string,
  options: { page: number; search: string; pageSize: number }
): Promise<{ members: MemberProfile[]; count: number }> {
  const from = (options.page - 1) * options.pageSize;
  const to = from + options.pageSize - 1;
  let query = supabase
    .from("profiles")
    .select(PROFILE_SELECT, { count: "exact" })
    .eq("club_id", clubId)
    .eq("role", "member");

  if (options.search) {
    query = query.ilike("full_name", `%${options.search}%`);
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  const profiles = await withAuthEmails(supabase, (data ?? []) as Profile[]);
  const members = profiles.map((profile) => ({
    ...profile,
    display_status: profile.status ?? "active",
    display_joined_at: profile.joined_at ?? profile.created_at ?? null,
  }));

  return { members, count: count ?? 0 };
}

export async function getClubMember(
  supabase: SupabaseClient,
  clubId: string,
  memberId: string
): Promise<MemberProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_SELECT)
    .eq("id", memberId)
    .eq("club_id", clubId)
    .eq("role", "member")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  const [member] = await withAuthEmails(supabase, [data as Profile]);

  return {
    ...member,
    display_status: member.status ?? "active",
    display_joined_at: member.joined_at ?? member.created_at ?? null,
  };
}

export async function findAuthUserByEmail(
  supabase: SupabaseClient,
  email: string
) {
  const normalizedEmail = email.trim().toLowerCase();

  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 1000,
    });

    if (error) {
      throw new Error(error.message);
    }

    const users = data.users as User[];
    const user = users.find(
      (candidate) => candidate.email?.toLowerCase() === normalizedEmail
    );

    if (user || users.length < 1000) {
      return user ?? null;
    }
  }

  return null;
}
