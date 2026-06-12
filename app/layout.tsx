import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "ABASA",
  description: "Landing page test",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
