"use client";

import { createContext, useState } from "react";

export const AuthContext = createContext({});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <AuthContext.Provider value={isLogin}>{children}</AuthContext.Provider>
  );
}
