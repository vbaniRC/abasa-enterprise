"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../providers/AuthProvider";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const menu = [
    { name: "Dashboard", href: "/dashboard/dashboard" },
    { name: "Users", href: "/dashboard/users" },
    { name: "Parents", href: "/dashboard/parents" },
    { name: "Coaches", href: "/dashboard/coaches" },
    { name: "Programs", href: "/dashboard/programs" },
    { name: "Groups", href: "/dashboard/groups" },
    { name: "Schedule", href: "/dashboard/schedule" },
    { name: "Payments", href: "/dashboard/payments" },
    { name: "Notifications", href: "/dashboard/notifications" },
    { name: "Club", href: "/dashboard/club" },
    { name: "Settings", href: "/dashboard/settings" },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col justify-between">
      <div>
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">ABASA Sport</h2>
          <p className="text-sm text-gray-500">Management Panel</p>
        </div>

        <nav className="p-4 space-y-2">
          {menu.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 rounded-md transition ${
                  active
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* USER PANEL */}
      <div className="p-4 border-t border-gray-200">
        {user ? (
          <div className="text-sm">
            <p className="font-medium">
              {user.user_metadata?.full_name || "User"}
            </p>
            <p className="text-gray-500 text-xs">{user.email}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Not signed in</p>
        )}
      </div>
    </aside>
  );
}
