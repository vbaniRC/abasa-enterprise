import type { Database } from "@/types/supabase";

type ClubRow = Database["public"]["Tables"]["club"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export type Club = ClubRow & {
  id: string;
  owner_id: string;
  address: string | null;
  phone: string | null;
  email: string | null;
};

export type Profile = Omit<ProfileRow, "role"> & {
  role: string | null;
  avatar_url?: string | null;
  status?: string | null;
  joined_at?: string | null;
  additional_data?: {
    status?: string | null;
    [key: string]: unknown;
  } | null;
};

export type ClubUser = Profile;

export type MemberProfile = Profile & {
  display_status: string;
  display_joined_at: string | null;
};
