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
          <div className="min-h-screen w-full flex items-center justify-center bg-black">
            <div className="w-full max-w-[460px] mx-auto">
              {children}
            </div>
          </div>
        ) : (
          <div className="min-h-screen bg-black">
            {children}
          </div>
        )}
      </body>
    </html>
  );
}
