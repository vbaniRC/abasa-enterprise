"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireUserClubId } from "@/app/dashboard/members/_lib/server";
import type {
  MemberActionResult,
  MemberRecord,
  MembersQuery,
  MembersResult,
  MemberStatus,
} from "@/app/dashboard/members/_lib/types";

const PAGE_SIZE = 10;
const statusSchema = z.enum(["all", "active", "inactive", "pending"]);
const memberIdSchema = z.coerce.number().int().positive();

const membersQuerySchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  search: z.string().trim().max(120).catch(""),
  status: statusSchema.catch("all"),
});

function toMemberStatus(active: boolean): MemberStatus {
  return active ? "active" : "inactive";
}

function toMemberRecord(member: {
  active: boolean;
  club_id: string;
  created_at: string | null;
  date_of_birth: string | null;
  email: string | null;
  first_name: string;
  id: number;
  last_name: string;
  phone: string | null;
}): MemberRecord {
  return {
    ...member,
    status: toMemberStatus(member.active),
  };
}

export async function getMembers(query: MembersQuery): Promise<MembersResult> {
  const parsed = membersQuerySchema.parse(query);
  const { supabase, clubId } = await requireUserClubId();
  const from = (parsed.page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  if (!clubId || parsed.status === "pending") {
    return {
      members: [],
      count: 0,
      clubFound: Boolean(clubId),
      page: parsed.page,
      pageSize: PAGE_SIZE,
      totalPages: 1,
      search: parsed.search,
      status: parsed.status,
    };
  }

  let membersQuery = supabase
    .from("members")
    .select(
      "id, club_id, first_name, last_name, email, phone, date_of_birth, active, created_at",
      { count: "exact" }
    )
    .eq("club_id", clubId);

  if (parsed.search) {
    membersQuery = membersQuery.or(
      `first_name.ilike.%${parsed.search}%,last_name.ilike.%${parsed.search}%,email.ilike.%${parsed.search}%,phone.ilike.%${parsed.search}%`
    );
  }

  if (parsed.status === "active") {
    membersQuery = membersQuery.eq("active", true);
  }

  if (parsed.status === "inactive") {
    membersQuery = membersQuery.eq("active", false);
  }

  const { data, error, count } = await membersQuery
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  const totalCount = count ?? 0;

  return {
    members: (data ?? []).map(toMemberRecord),
    count: totalCount,
    clubFound: true,
    page: parsed.page,
    pageSize: PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(totalCount / PAGE_SIZE)),
    search: parsed.search,
    status: parsed.status,
  };
}

export async function getMemberById(memberId: number | string) {
  const parsedMemberId = memberIdSchema.parse(memberId);
  const { supabase, clubId } = await requireUserClubId();

  if (!clubId) {
    return null;
  }

  const { data, error } = await supabase
    .from("members")
    .select(
      "id, club_id, first_name, last_name, email, phone, date_of_birth, active, created_at"
    )
    .eq("id", parsedMemberId)
    .eq("club_id", clubId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? toMemberRecord(data) : null;
}

export async function deleteMember(
  memberId: number | string
): Promise<MemberActionResult> {
  const parsed = memberIdSchema.safeParse(memberId);

  if (!parsed.success) {
    return { ok: false, message: "Invalid member ID." };
  }

  const { supabase, clubId } = await requireUserClubId();

  if (!clubId) {
    return { ok: false, message: "Club not found." };
  }

  const { error } = await supabase
    .from("members")
    .delete()
    .eq("id", parsed.data)
    .eq("club_id", clubId);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/dashboard/members");

  return { ok: true, message: "Member deleted." };
}
