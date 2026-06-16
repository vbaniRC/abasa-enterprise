"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  BadgeCheck,
  BookOpen,
  CalendarCheck,
  CreditCard,
  LayoutDashboard,
  Layers,
  LogOut,
  Settings,
  User,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

type SidebarLink = {
  name: string;
  href: string;
  icon: LucideIcon;
};

type SidebarItemProps = SidebarLink & {
  isActive: boolean;
  isCollapsed: boolean;
};

const sidebarLinks: SidebarLink[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Members", href: "/dashboard/members", icon: Users },
  { name: "Parents", href: "/dashboard/parents", icon: UserRound },
  { name: "Groups", href: "/dashboard/groups", icon: Layers },
  { name: "Programs", href: "/dashboard/programs", icon: BookOpen },
  { name: "Coaches", href: "/dashboard/coaches", icon: BadgeCheck },
  { name: "Attendance", href: "/dashboard/attendance", icon: CalendarCheck },
  { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { name: "Club Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Logout", href: "/auth/logout", icon: LogOut },
];

function isRouteActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarItem({
  name,
  href,
  icon: Icon,
  isActive,
  isCollapsed,
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      aria-label={name}
      className={clsx(
        "group flex h-11 items-center gap-3 rounded-lg border-l-[3px] text-sm transition-colors duration-150",
        isCollapsed ? "justify-center px-0" : "px-4",
        isActive
          ? "border-violet-400 font-semibold text-violet-300"
          : "border-transparent text-content-muted hover:bg-surface-raised/80 hover:text-content"
      )}
    >
      <Icon
        aria-hidden="true"
        className={clsx(
          "h-5 w-5 shrink-0 transition-opacity duration-150 group-hover:opacity-100",
          isActive ? "opacity-100" : "opacity-80"
        )}
        strokeWidth={2}
      />

      <span
        className={clsx(
          "overflow-hidden whitespace-nowrap transition-[opacity,width] duration-200",
          isCollapsed
            ? "w-0 opacity-0"
            : "w-auto opacity-100"
        )}
      >
        {name}
      </span>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isTriggerHovered, setIsTriggerHovered] = useState(false);

  const triggerGlyph = isTriggerHovered ? (isCollapsed ? ">" : "<") : "|";

  return (
    <aside
      className={clsx(
        "sticky top-0 flex h-screen shrink-0 flex-col border-r border-border/70 bg-background text-content transition-[width] duration-200 ease-in-out",
        isCollapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      <button
        type="button"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!isCollapsed}
        onBlur={() => setIsTriggerHovered(false)}
        onFocus={() => setIsTriggerHovered(true)}
        onClick={() => setIsCollapsed((current) => !current)}
        onMouseEnter={() => setIsTriggerHovered(true)}
        onMouseLeave={() => setIsTriggerHovered(false)}
        className="absolute left-0 top-1/2 z-10 flex h-20 w-7 -translate-y-1/2 items-center justify-center rounded-r-md border border-l-0 border-border/70 bg-background text-content-subtle transition-colors duration-150 hover:bg-surface-raised hover:text-content"
      >
        <span className="font-mono text-lg leading-none">{triggerGlyph}</span>
      </button>

      <div
        className={clsx(
          "flex h-20 items-center border-b border-border/60",
          isCollapsed ? "justify-center px-0" : "px-6"
        )}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-sm font-bold text-violet-300">
          A
        </div>

        <div
          className={clsx(
            "ml-3 overflow-hidden transition-[opacity,width] duration-200",
            isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          )}
        >
          <p className="whitespace-nowrap text-sm font-semibold text-content">
            ABASA Sport
          </p>
          <p className="whitespace-nowrap text-xs text-content-subtle">Workspace</p>
        </div>
      </div>

      <nav
        aria-label="Dashboard navigation"
        className={clsx("flex flex-1 flex-col gap-1.5 py-5", isCollapsed ? "px-3" : "px-4")}
      >
        {sidebarLinks.map((item) => (
          <SidebarItem
            key={item.href}
            {...item}
            isActive={isRouteActive(pathname, item.href)}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>
    </aside>
  );
}
