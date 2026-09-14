import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TalentPool",
  description:
    "AI-powered job candidate search",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}