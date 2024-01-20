"use client";

import type { ProSettings } from "@ant-design/pro-components";
import { PageContainer, ProCard, ProLayout } from "@ant-design/pro-components";
import {
  GithubFilled,
  InfoCircleFilled,
  PlusCircleFilled,
  QuestionCircleFilled,
  SearchOutlined,
} from "@ant-design/icons";

import { Spin, Flex } from "antd";

import Link from "next/link";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";

import { AuthContext } from "./authProvider";

import styles from "./page.module.css";

export default function Home() {
  const { push } = useRouter();
  const {isLogin} = useContext(AuthContext);

  useEffect(() => {
    console.log("login:", isLogin);
    if (!isLogin) {
      push("/login");
    } else {
      push("/index");
    }
  }, []);

  return (
    <Flex vertical className={styles.centerBody}>
      <Spin size="large" tip="MorTnon，高质量的快速开发框架">
        <div className="content" />
      </Spin>
    </Flex>
  );
}
