"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    const { data } = await supabase
      .from("groups")
      .select("id, name")
      .order("name", { ascending: true });

    setGroups(data || []);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Groups</h1>

        <Link
          href="/dashboard/groups/add"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Add Group
        </Link>
      </div>

      <div className="space-y-4">
        {groups.map((g) => (
          <Link
            key={g.id}
            href={`/dashboard/groups/${g.id}`}
            className="block border rounded-lg p-4 hover:bg-gray-50"
          >
            {g.name}
          </Link>
        ))}

        {groups.length === 0 && (
          <p className="text-gray-500">No groups found.</p>
        )}
      </div>
    </div>
  );
}
