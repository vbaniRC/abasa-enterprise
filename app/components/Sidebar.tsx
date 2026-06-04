// app/components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Početna" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/users", label: "Članovi" },
  { href: "/club", label: "Klub" },
  { href: "/settings", label: "Postavke" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6">
      <h1 className="text-2xl font-bold mb-8">ABASA Sport</h1>

      <nav className="space-y-2">
        {links.map((link) => {
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                block px-3 py-2 rounded-md transition
                ${active ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}
              `}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

