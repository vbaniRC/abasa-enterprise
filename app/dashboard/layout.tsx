import RootProvider from "../providers/RootProvider";

export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }) {
  return <RootProvider>{children}</RootProvider>;
}
