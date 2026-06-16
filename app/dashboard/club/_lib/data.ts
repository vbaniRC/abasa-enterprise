import "server-only";

import type { SupabaseClient, User } from "@supabase/supabase-js";

import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

import { requireDashboardUser } from "./server";
import type { Club, MemberProfile, Profile } from "./types";

const PROFILE_SELECT = "*";
type Supabase = SupabaseClient<Database>;
type ClubRow = Database["public"]["Tables"]["club"]["Row"];

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

function normalizeClub(club: ClubRow, ownerId: string): Club {
  return {
    ...club,
    owner_id: ownerId,
    address: club.adresa_sjedista,
    phone: club.sluzbeni_telefon,
    email: club.sluzbeni_email,
  };
}

async function withAuthEmails<T extends Profile>(
  supabase: Supabase,
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
  supabase: Supabase,
  userId: string
): Promise<Club | null> {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(PROFILE_SELECT)
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    throw new Error(profileError.message);
  }

  if (!profile?.club_id) {
    return null;
  }

  const { data: club, error } = await supabase
    .from("club")
    .select("*")
    .eq("id", profile.club_id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!club) {
    return null;
  }

  const { data: ownerProfile } = await supabase
    .from("profiles")
    .select(PROFILE_SELECT)
    .eq("club_id", profile.club_id)
    .eq("is_owner", true)
    .maybeSingle();

  return normalizeClub(club, ownerProfile?.id ?? profile.id);
}

export async function getClubContext(): Promise<{
  user: User;
  supabase: Supabase;
  club: Club | null;
  owner: Profile | null;
  profile: Profile | null;
}> {
  const user = await requireDashboardUser();
  const supabase = createSupabaseAdminClient();
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(PROFILE_SELECT)
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error(profileError.message);
  }

  if (!profile?.club_id) {
    return { user, supabase, club: null, owner: null, profile: null };
  }

  const { data: clubRow, error: clubError } = await supabase
    .from("club")
    .select("*")
    .eq("id", profile.club_id)
    .maybeSingle();

  if (clubError) {
    throw new Error(clubError.message);
  }

  if (!clubRow) {
    return {
      user,
      supabase,
      club: null,
      owner: null,
      profile: normalizeProfile(profile as Profile),
    };
  }

  const { data: ownerProfile } = await supabase
    .from("profiles")
    .select(PROFILE_SELECT)
    .eq("club_id", profile.club_id)
    .eq("is_owner", true)
    .maybeSingle();

  const normalizedProfile = normalizeProfile(profile as Profile);
  const [owner] = await withAuthEmails(
    supabase,
    ownerProfile
      ? [ownerProfile as Profile]
      : profile.is_owner
        ? [normalizedProfile]
        : [
            {
              id: user.id,
              full_name: user.user_metadata?.full_name ?? null,
              role: "owner",
              club_id: profile.club_id,
              email: user.email ?? null,
              is_owner: true,
              created_at: null,
            },
          ]
  );
  const club = normalizeClub(clubRow, owner?.id ?? profile.id);

  return { user, supabase, club, owner, profile: normalizedProfile };
}

export async function getClubCoaches(
  supabase: Supabase,
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
  supabase: Supabase,
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
  supabase: Supabase,
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
  supabase: Supabase,
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
