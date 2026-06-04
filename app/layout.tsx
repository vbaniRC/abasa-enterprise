export const metadata = {
  title: "ABASA Clean",
  description: "Clean Next.js structure",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
