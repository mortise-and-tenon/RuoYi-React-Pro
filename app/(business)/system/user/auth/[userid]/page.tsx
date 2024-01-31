"use client";

import {
  PageContainer,
  ProDescriptions,
  ProTable,
  ProCard,
  ProForm,
  ProFormText,
} from "@ant-design/pro-components";

import { Divider, message } from "antd";

import { fetchApi } from "@/app/_modules/func";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserAuth({ params }: { params: { userid: string } }) {
  const { push } = useRouter();

  //用户信息
  const [user, setUser] = useState({});
  //角色信息
  const [roles, setRoles] = useState([]);

  const getUserData = async () => {
    const body = await fetchApi(
      `/api/system/user/authRole/${params.userid}`,
      push
    );
    if (body !== undefined) {
      if (body.code == 200) {
        setUser(body.user);
        setRoles(body.roles);
      }
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <PageContainer
      header={{
        title: "分配角色",
        onBack(e) {
          push("/system/user");
        },
      }}
    >
      <ProCard>
        <ProDescriptions title="基本信息" column={24}>
          <ProDescriptions.Item span={12} label="用户昵称">
            {user.nickName}
          </ProDescriptions.Item>
          <ProDescriptions.Item span={12} label="用户名称">
            {user.userName}
          </ProDescriptions.Item>
        </ProDescriptions>
      </ProCard>
      <Divider />
      <ProCard>
        <ProDescriptions title="角色信息" column={24}>
          <ProDescriptions.Item span={12} label="用户昵称">
            123
          </ProDescriptions.Item>
          <ProDescriptions.Item span={12} label="用户名称">
            321
          </ProDescriptions.Item>
        </ProDescriptions>
      </ProCard>
    </PageContainer>
  );
}
