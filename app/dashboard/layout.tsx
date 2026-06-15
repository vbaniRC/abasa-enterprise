import RootProvider from "../providers/RootProvider";

export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-black">
      <RootProvider>{children}</RootProvider>
    </div>
  );
}
