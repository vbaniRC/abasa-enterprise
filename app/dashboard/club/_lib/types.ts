export type Club = {
  id: string;
  owner_id: string;
  name: string;
  address: string | null;
  city: string | null;
  country: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  created_at: string | null;
};

export type Profile = {
  id: string;
  full_name: string | null;
  role: string | null;
  club_id: string | null;
  avatar_url?: string | null;
  email?: string | null;
  status?: string | null;
  joined_at?: string | null;
  created_at?: string | null;
  additional_data?: {
    status?: string | null;
    [key: string]: unknown;
  } | null;
};

export type MemberProfile = Profile & {
  display_status: string;
  display_joined_at: string | null;
};
