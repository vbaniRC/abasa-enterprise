"use client";

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
      onClick={onNavigate}
      className={clsx(
        "group relative flex h-11 items-center gap-3 rounded-lg border-l-[3px] text-sm transition-all duration-[180ms] ease-in-out",
        isCollapsed ? "justify-center px-0" : "px-4",
        isActive
          ? "border-violet-400 font-semibold text-violet-300"
          : "border-transparent text-content-muted hover:border-sky-300 hover:bg-sky-400/10 hover:text-content"
      )}
    >
      <Icon
        aria-hidden="true"
        className={clsx(
          "h-5 w-5 shrink-0 transition-opacity duration-[180ms] ease-in-out group-hover:opacity-100",
          isActive ? "opacity-100" : "opacity-70"
        )}
        strokeWidth={2}
      />

      <span
        className={clsx(
          "overflow-hidden whitespace-nowrap transition-[opacity,width] duration-[275ms] ease-in-out",
          isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
        )}
      >
        {name}
      </span>

      {isCollapsed ? (
        <span className="pointer-events-none absolute left-[calc(100%+0.75rem)] top-1/2 z-[80] -translate-y-1/2 whitespace-nowrap rounded-md border border-border/70 bg-surface-overlay px-2.5 py-1.5 text-xs font-medium text-content opacity-0 shadow-lg transition-opacity duration-[180ms] ease-in-out group-hover:opacity-100">
          {name}
        </span>
      ) : null}
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [isTriggerHovered, setIsTriggerHovered] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const syncViewport = () => {
      setIsMobileViewport(mediaQuery.matches);
      if (!mediaQuery.matches) {
        setIsMobileOpen(false);
      }
    };

    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);

    return () => mediaQuery.removeEventListener("change", syncViewport);
  }, []);

  useEffect(() => {
    if (!isMobileOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileOpen]);

  const isSidebarHidden = isMobileViewport && !isMobileOpen;
  const triggerGlyph = isTriggerHovered
    ? isSidebarHidden || isCollapsed
      ? ">"
      : "<"
    : "|";

  const handleTriggerClick = () => {
    if (isSidebarHidden) {
      setIsMobileOpen(true);
      setIsCollapsed(false);
      return;
    }

    setIsCollapsed((current) => !current);
  };

  const handleNavigate = () => {
    if (isMobileViewport) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {isMobileOpen ? (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/60 transition-opacity duration-[275ms] ease-in-out lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      ) : null}

      <button
        type="button"
        aria-label={isSidebarHidden || isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!isSidebarHidden && !isCollapsed}
        onBlur={() => setIsTriggerHovered(false)}
        onFocus={() => setIsTriggerHovered(true)}
        onClick={handleTriggerClick}
        onMouseEnter={() => setIsTriggerHovered(true)}
        onMouseLeave={() => setIsTriggerHovered(false)}
        className="fixed left-0 top-1/2 z-[70] flex h-20 w-7 -translate-y-1/2 items-center justify-center rounded-r-md border border-l-0 border-border/70 bg-background text-content-subtle transition-colors duration-[180ms] ease-in-out hover:bg-surface-raised hover:text-content"
      >
        <span className="font-mono text-lg leading-none">{triggerGlyph}</span>
      </button>

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 flex h-dvh shrink-0 flex-col border-r border-border/70 bg-background text-content shadow-xl transition-[transform,width] duration-[275ms] ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:shadow-none",
          isCollapsed ? "w-[72px]" : "w-[260px]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div
          className={clsx(
            "flex h-20 items-center border-b border-border/60 transition-[padding] duration-[275ms] ease-in-out",
            isCollapsed ? "justify-center px-0" : "px-6"
          )}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-sm font-bold text-violet-300">
            A
          </div>

          <div
            className={clsx(
              "ml-3 overflow-hidden transition-[opacity,width] duration-[275ms] ease-in-out",
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
          className={clsx(
            "flex flex-1 flex-col gap-1.5 py-5 transition-[padding] duration-[275ms] ease-in-out",
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
      </aside>
    </>
  );
}
