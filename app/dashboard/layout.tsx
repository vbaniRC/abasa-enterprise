export const dynamic = "force-dynamic";

import RootProvider from "../providers/RootProvider";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-black">
      <RootProvider>{children}</RootProvider>
    </div>
  );
}
