/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import {
  BuildingOffice2Icon,
  EnvelopeIcon,
  MapPinIcon,
  PencilSquareIcon,
  PhoneIcon,
  PhotoIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

import {
  ClubCard,
  ClubShell,
  EmptyClubState,
} from "@/app/dashboard/club/_components/ClubShell";
import { getClubContext } from "@/app/dashboard/club/_lib/data";

export const dynamic = "force-dynamic";

const quickLinks = [
  {
    href: "/dashboard/club/edit",
    title: "Edit details",
    description: "Update address and contact information.",
    icon: PencilSquareIcon,
  },
  {
    href: "/dashboard/club/logo",
    title: "Logo",
    description: "Upload a new public club logo.",
    icon: PhotoIcon,
  },
  {
    href: "/dashboard/club/roles",
    title: "Roles",
    description: "Manage owner and coach access.",
    icon: ShieldCheckIcon,
  },
  {
    href: "/dashboard/club/members",
    title: "Members",
    description: "Browse members assigned to this club.",
    icon: UserGroupIcon,
  },
];

function valueOrDash(value?: string | null) {
  return value && value.trim().length > 0 ? value : "-";
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-base font-semibold text-white">
        {valueOrDash(value)}
      </p>
    </div>
  );
}

export default async function ClubPage() {
  const { club, owner } = await getClubContext();

  if (!club) {
    return <EmptyClubState />;
  }

  return (
    <ClubShell
      title={club.name}
      description="Manage the single club connected to your authenticated account."
    >
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <ClubCard title="Club overview">
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-slate-950/50">
              {club.logo_url ? (
                <img
                  src={club.logo_url}
                  alt={`${club.name} logo`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <BuildingOffice2Icon className="h-14 w-14 text-slate-500" />
              )}
            </div>
            <div className="grid flex-1 gap-4 sm:grid-cols-2">
              <InfoRow label="Club name" value={club.name} />
              <InfoRow label="City" value={club.city} />
              <InfoRow label="Country" value={club.country} />
              <InfoRow label="Created" value={club.created_at?.slice(0, 10)} />
            </div>
          </div>
        </ClubCard>

        <ClubCard title="Owner info">
          <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <div className="rounded-2xl bg-blue-300/10 p-3 text-blue-100">
              <UserCircleIcon className="h-8 w-8" />
            </div>
            <div>
              <p className="text-lg font-semibold text-white">
                {valueOrDash(owner?.full_name)}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                {valueOrDash(owner?.email)}
              </p>
              <p className="mt-3 w-fit rounded-full border border-blue-300/25 bg-blue-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">
                Owner
              </p>
            </div>
          </div>
        </ClubCard>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <ClubCard title="Contact information">
          <div className="space-y-4">
            <div className="flex gap-3 text-slate-300">
              <EnvelopeIcon className="h-5 w-5 text-blue-200" />
              <span>{valueOrDash(club.email)}</span>
            </div>
            <div className="flex gap-3 text-slate-300">
              <PhoneIcon className="h-5 w-5 text-blue-200" />
              <span>{valueOrDash(club.phone)}</span>
            </div>
          </div>
        </ClubCard>

        <ClubCard title="Address">
          <div className="flex gap-3 text-slate-300">
            <MapPinIcon className="h-5 w-5 shrink-0 text-blue-200" />
            <span>
              {[club.address, club.city, club.country]
                .filter(Boolean)
                .join(", ") || "-"}
            </span>
          </div>
        </ClubCard>

        <ClubCard title="Quick links">
          <div className="space-y-3">
            {quickLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4 transition hover:border-blue-200/40 hover:bg-blue-300/10"
                >
                  <Icon className="h-5 w-5 text-blue-200" />
                  <span>
                    <span className="block font-semibold text-white">
                      {item.title}
                    </span>
                    <span className="text-sm text-slate-400">
                      {item.description}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </ClubCard>
      </section>
    </ClubShell>
  );
}
