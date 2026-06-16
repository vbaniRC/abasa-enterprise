import Sidebar from "@/components/Sidebar";

export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }) {
  return (
    <Sidebar>
      {children}
    </Sidebar>
  );
}
