import type { Metadata } from "next";
import "./normalize.css";

export const metadata: Metadata = {
  title: "MorTnon RuoYi",
  description: "MorTnon 的高级 RuoYi 前台",
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
