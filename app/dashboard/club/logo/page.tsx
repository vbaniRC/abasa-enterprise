import {
  ClubCard,
  ClubShell,
  EmptyClubState,
} from "@/app/dashboard/club/_components/ClubShell";
import { LogoUpload } from "@/app/dashboard/club/_components/LogoUpload";
import { getClubContext } from "@/app/dashboard/club/_lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ClubLogoPage() {
  const { club } = await getClubContext();

  if (!club) {
    return <EmptyClubState />;
  }

  return (
    <ClubShell
      title="Club logo"
      description="Upload a branded logo to Supabase Storage and attach it to this club."
      backHref="/dashboard/club"
    >
      <ClubCard
        title="Logo upload"
        description="The upload is handled in the browser and the saved public URL is verified on the server."
      >
        <LogoUpload
          clubId={club.id}
          clubName={club.name}
          initialLogoUrl={club.logo_url}
        />
      </ClubCard>
    </ClubShell>
  );
}
