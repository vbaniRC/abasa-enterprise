import type { ReactNode } from "react";
import RootProvider from "../providers/RootProvider";

export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <RootProvider>{children}</RootProvider>;
}
