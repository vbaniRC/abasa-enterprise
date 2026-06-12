import "./globals.css";

export const metadata = {
  title: "ABASA",
  description: "Landing page",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
