import Sidebar from "@/components/Sidebar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-background text-content lg:flex">
      <Sidebar />
      <div className="min-w-0 flex-1 transition-all duration-[275ms] ease-in-out">
        {children}
      </div>
    </div>
  );
}
