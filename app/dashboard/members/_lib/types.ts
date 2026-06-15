import type { Database } from "@/types/supabase";

export type MemberRow = Database["public"]["Tables"]["members"]["Row"];
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type MemberStatus = "active" | "inactive" | "pending";

export type MemberRecord = MemberRow & {
  status: MemberStatus;
};

export type MembersQuery = {
  page?: number;
  search?: string;
  status?: MemberStatus | "all";
};

export type MembersResult = {
  members: MemberRecord[];
  count: number;
  clubFound: boolean;
  page: number;
  pageSize: number;
  totalPages: number;
  search: string;
  status: MemberStatus | "all";
};

export type MemberActionResult = {
  ok: boolean;
  message: string;
};
