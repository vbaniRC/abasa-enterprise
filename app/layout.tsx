import "./globals.css";
import { AuthProvider } from "./providers/AuthProvider";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "ABASA",
  description: "Landing page test",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
