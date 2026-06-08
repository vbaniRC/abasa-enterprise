import "./globals.css";
import { usePathname } from "next/navigation";

export const metadata = {
  title: "ABASA",
  description: "Management Panel",
};

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAuth = pathname?.startsWith("/auth") ?? false;

  return (
    <html lang="en">
      <body className="text-white">
        {isAuth ? (
          <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <div className="w-full max-w-md">
              {children}
            </div>
          </div>
        ) : (
          <div className="bg-black min-h-screen">
            {children}
          </div>
        )}
      </body>
    </html>
  );
}
