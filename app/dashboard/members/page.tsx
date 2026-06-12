"use client";

import Link from "next/link";

export default function MembersPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Members</h1>

        <Link
          href="/dashboard/members/add"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Add Member
        </Link>
      </div>

      <p className="text-gray-500">
        Members list will appear here.
      </p>
    </div>
  );
}
