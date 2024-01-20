"use client";

import React, { createContext, useState } from "react";

interface AuthContextProps {
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  userToken: string;
  setUserToken: React.Dispatch<React.SetStateAction<string>>;
}
export const AuthContext = createContext<AuthContextProps>({
  isLogin: false,
  setIsLogin: () => {},
  userToken: "",
  setUserToken: () => {},
});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLogin, setIsLogin] = useState(false);
  const [userToken, setUserToken] = useState("");

  return (
    <AuthContext.Provider
      value={{ isLogin, setIsLogin, userToken, setUserToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}
