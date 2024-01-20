"use client";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/authProvider";
import { useEffect, useContext } from "react";
export default function Index() {
  const { push } = useRouter();
  const { isLogin } = useContext(AuthContext);

  useEffect(() => {
    console.log("login:", isLogin);
    if (!isLogin) {
      push("/login");
    }
  }, []);
  return <div>welcome</div>;
}
