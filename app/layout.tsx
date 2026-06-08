import "./globals.css";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "ABASA",
  description: "Management Panel",
};

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAuth = pathname?.startsWith("/auth") ?? false;

  return (
    <html lang="en" className={inter.variable}>
      <body className="text-white font-sans">
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
