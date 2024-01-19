import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "./normalize.css";
import { createContext } from "react";
import AuthProvider from "./authProvider";

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
      <body>
        <AuthProvider>
          <AntdRegistry>{children}</AntdRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
