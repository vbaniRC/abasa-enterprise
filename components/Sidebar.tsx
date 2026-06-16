"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
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

type SidebarProps = {
  children?: ReactNode;
  className?: string;
};

type SidebarItemProps = SidebarLink & {
  isActive: boolean;
  isCollapsed: boolean;
  onNavigate: () => void;
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
  onNavigate,
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      aria-label={name}
      title={isCollapsed ? name : undefined}
      onClick={onNavigate}
      className={clsx(
        "group/navitem relative flex h-11 items-center gap-3 rounded-xl border-l-[3px] px-4 text-sm outline-none transition-all duration-[180ms] ease-in-out",
        isCollapsed ? "justify-center px-0" : "justify-start",
        isActive
          ? "border-violet-400 bg-violet-500/10 font-semibold text-violet-300"
          : "border-transparent text-content-muted hover:border-sky-300/80 hover:bg-sky-400/10 hover:text-content"
      )}
    >
      <Icon
        aria-hidden="true"
        className={clsx(
          "h-5 w-5 shrink-0 transition-opacity duration-[180ms] ease-in-out group-hover/navitem:opacity-100",
          isActive ? "opacity-100" : "opacity-75"
        )}
        strokeWidth={2}
      />

      <span
        className={clsx(
          "whitespace-nowrap transition-all duration-[275ms] ease-in-out",
          isCollapsed
            ? "w-0 translate-x-2 overflow-hidden opacity-0"
            : "w-auto translate-x-0 opacity-100"
        )}
      >
        {name}
      </span>

      {isCollapsed ? (
        <span className="pointer-events-none absolute left-[calc(100%+0.75rem)] top-1/2 z-[70] hidden -translate-y-1/2 whitespace-nowrap rounded-lg border border-border/80 bg-surface-overlay px-3 py-1.5 text-xs font-medium text-content opacity-0 shadow-lg transition-opacity duration-[180ms] ease-in-out group-hover/navitem:opacity-100 lg:block">
          {name}
        </span>
      ) : null}
    </Link>
  );
}

export default function Sidebar({ children, className }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [isTriggerHovered, setIsTriggerHovered] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const syncViewport = () => {
      setIsDesktop(mediaQuery.matches);
      if (mediaQuery.matches) {
        setIsMobileOpen(false);
      }
    };

    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);

    return () => mediaQuery.removeEventListener("change", syncViewport);
  }, []);

  const handleToggle = () => {
    if (!isDesktop && !isMobileOpen) {
      setIsMobileOpen(true);
      setIsCollapsed(false);
      return;
    }

    setIsCollapsed((current) => !current);
  };

  const handleNavigate = () => {
    if (!isDesktop) {
      setIsMobileOpen(false);
    }
  };

  const triggerDirection = isCollapsed || (!isDesktop && !isMobileOpen) ? ">" : "<";
  const triggerLabel =
    !isDesktop && !isMobileOpen
      ? "Open sidebar"
      : isCollapsed
        ? "Expand sidebar"
        : "Collapse sidebar";

  return (
    <div className={clsx("relative min-h-screen bg-background text-content lg:flex", className)}>
      {!isDesktop && isMobileOpen ? (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 cursor-default bg-black/55 backdrop-blur-sm transition-opacity duration-[275ms] ease-in-out lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      ) : null}

      <button
        type="button"
        aria-label={triggerLabel}
        aria-expanded={!isCollapsed}
        onBlur={() => setIsTriggerHovered(false)}
        onFocus={() => setIsTriggerHovered(true)}
        onClick={handleToggle}
        onMouseEnter={() => setIsTriggerHovered(true)}
        onMouseLeave={() => setIsTriggerHovered(false)}
        onPointerEnter={() => setIsTriggerHovered(true)}
        onPointerLeave={() => setIsTriggerHovered(false)}
        className={clsx(
          "fixed left-0 top-1/2 z-[70] flex h-24 w-9 -translate-y-1/2 items-center justify-center rounded-r-xl border border-l-0 shadow-lg ring-1 ring-black/20 transition-colors duration-[180ms] ease-in-out focus-visible:z-[80]",
          isTriggerHovered
            ? "border-sky-200 bg-sky-300 text-slate-950"
            : "border-sky-300/25 bg-surface-overlay/95 text-content"
        )}
      >
        <span className="font-mono text-xl font-semibold leading-none">
          {isTriggerHovered ? triggerDirection : "|"}
        </span>
      </button>

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 flex h-dvh shrink-0 flex-col border-r border-border/70 bg-background shadow-xl transition-[width,transform,box-shadow] duration-[275ms] ease-in-out lg:sticky lg:top-0 lg:z-30 lg:translate-x-0 lg:shadow-none",
          isCollapsed ? "w-[72px]" : "w-[260px]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div
          className={clsx(
            "flex h-20 items-center border-b border-border/60 transition-all duration-[275ms] ease-in-out",
            isCollapsed ? "justify-center px-0" : "justify-start px-6"
          )}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-500/15 text-sm font-bold text-violet-300 ring-1 ring-violet-400/25">
            A
          </div>

          <div
            className={clsx(
              "ml-3 overflow-hidden transition-all duration-[275ms] ease-in-out",
              isCollapsed ? "w-0 translate-x-2 opacity-0" : "w-auto translate-x-0 opacity-100"
            )}
          >
            <p className="whitespace-nowrap text-sm font-semibold tracking-wide text-content">
              ABASA Sport
            </p>
            <p className="whitespace-nowrap text-xs text-content-subtle">Workspace</p>
          </div>
        </div>

        <nav
          aria-label="Dashboard navigation"
          className={clsx(
            "flex flex-1 flex-col gap-1.5 py-5 transition-all duration-[275ms] ease-in-out",
            isCollapsed ? "px-3" : "px-4"
          )}
        >
          {sidebarLinks.map((item) => (
            <SidebarItem
              key={item.href}
              {...item}
              isActive={isRouteActive(pathname, item.href)}
              isCollapsed={isCollapsed}
              onNavigate={handleNavigate}
            />
          ))}
        </nav>

        <div
          className={clsx(
            "border-t border-border/60 py-4 text-xs text-content-subtle transition-all duration-[275ms] ease-in-out",
            isCollapsed ? "px-3 text-center" : "px-6"
          )}
        >
          <span className={clsx(isCollapsed ? "sr-only" : "block")}>
            ABASA — Powered by Copilot
          </span>
          {isCollapsed ? <span aria-hidden="true">AB</span> : null}
        </div>
      </aside>

      {children ? (
        <main className="min-w-0 flex-1 bg-background transition-all duration-[275ms] ease-in-out">
          {children}
        </main>
      ) : null}
    </div>
  );
}
