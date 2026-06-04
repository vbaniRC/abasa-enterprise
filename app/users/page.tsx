// (GITHUB-PUTANJA-FILE: /abasa-sport/app/users/page.tsx)

"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadUsers() {
      const { data: session } = await supabase.auth.getUser();
      if (!session?.user) return;

      const res = await fetch("/api/users/list");
      const json = await res.json();

      if (json.success) {
        setUsers(json.data);
        setFiltered(json.data);
      }
    }

    loadUsers();
  }, []);

  useEffect(() => {
    const s = search.toLowerCase();
    setFiltered(
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(s) ||
          u.email.toLowerCase().includes(s) ||
          u.role.toLowerCase().includes(s)
      )
    );
  }, [search, users]);

  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8">

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold">Users</h1>

          <button
            onClick={() => alert("Add User form coming soon")}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-md"
          >
            Add User
          </button>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search users..."
          className="w-full p-3 border rounded-md mb-6"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Created</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center opacity-60">
                    No users found
                  </td>
                </tr>
              )}

              {filtered.map((u) => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 capitalize">{u.role}</td>
                  <td className="p-3">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
