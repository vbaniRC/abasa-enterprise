"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

import { deleteMember } from "@/app/dashboard/members/_lib/actions";

export function DeleteMemberButton({ memberId }: { memberId: number }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function handleDelete() {
    const confirmed = window.confirm(
      "Delete this member? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    startTransition(() => {
      void deleteMember(memberId).then((result) => {
        if (!result.ok) {
          setMessage(result.message);
          return;
        }

        router.push("/dashboard/members");
        router.refresh();
      });
    });
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        disabled={isPending}
        onClick={handleDelete}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-300/25 px-5 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-300/10 disabled:opacity-60"
      >
        <TrashIcon className="h-5 w-5" />
        {isPending ? "Deleting..." : "Delete member"}
      </button>
      {message ? (
        <p className="rounded-2xl border border-rose-300/25 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">
          {message}
        </p>
      ) : null}
    </div>
  );
}
