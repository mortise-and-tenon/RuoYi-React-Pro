"use client";


import { Flex, Spin } from "antd";


import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import styles from "./page.module.css";

export default function Home() {
  const { push } = useRouter();

  useEffect(() => {
    const token = getCookie("token");
    if (token === "") {
      push("/login");
    } else {
      push("/index");
    }
  });

  return (
    <Flex vertical className={styles.centerBody}>
      <Spin size="large" tip="MorTnon，高质量的快速开发框架">
        <div className="content" />
      </Spin>
    </Flex>
  );
}
