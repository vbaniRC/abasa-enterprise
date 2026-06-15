"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { MemberStatus } from "@/app/dashboard/members/_lib/types";

const statuses: Array<{ label: string; value: MemberStatus | "all" }> = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Pending", value: "pending" },
];

export function StatusFilter({
  value = "all",
}: {
  value?: MemberStatus | "all";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function applyStatus(nextStatus: MemberStatus | "all") {
    const params = new URLSearchParams(searchParams.toString());

    if (nextStatus === "all") {
      params.delete("status");
    } else {
      params.set("status", nextStatus);
    }

    params.set("page", "1");
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => {
        const selected = status.value === value;

        return (
          <button
            key={status.value}
            type="button"
            disabled={isPending}
            onClick={() => applyStatus(status.value)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition disabled:opacity-60 ${
              selected
                ? "border-blue-200 bg-blue-200 text-slate-950"
                : "border-white/10 text-slate-300 hover:border-white/25 hover:text-white"
            }`}
          >
            {status.label}
          </button>
        );
      })}
    </div>
  );
}
