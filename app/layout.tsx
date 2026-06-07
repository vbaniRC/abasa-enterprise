import "./globals.css";

export const metadata = {
  title: "ABASA",
  description: "Management Panel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">{children}</body>
    </html>
  );
}
