"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

export function MemberSearch({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(defaultValue);
  const [isPending, startTransition] = useTransition();

  function updateSearch(nextValue: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (nextValue) {
      params.set("search", nextValue);
    } else {
      params.delete("search");
    }

    params.set("page", "1");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        updateSearch(value.trim());
      }}
      className="flex flex-col gap-3 sm:flex-row"
    >
      <div className="relative flex-1">
        <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
        <input
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search members by name..."
          className="w-full rounded-2xl border border-white/10 bg-slate-950/60 py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-blue-200/60 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-2xl bg-blue-200 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white disabled:opacity-60"
      >
        Search
      </button>
      {defaultValue ? (
        <button
          type="button"
          onClick={() => {
            setValue("");
            updateSearch("");
          }}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/25 hover:text-white"
        >
          <XMarkIcon className="h-4 w-4" />
          Clear
        </button>
      ) : null}
    </form>
  );
}
