import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "./normalize.css";

export const metadata: Metadata = {
  title: "MorTnon RuoYi",
  description: "MorTnon 版本高级 RuoYi 前台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
