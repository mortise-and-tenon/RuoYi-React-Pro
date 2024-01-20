"use client";

import {
  GithubFilled,
  InfoCircleFilled,
  PlusCircleFilled,
  QuestionCircleFilled,
  SearchOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import type { ProSettings } from "@ant-design/pro-components";
import { ProLayout } from "@ant-design/pro-components";

import { Input, Dropdown, MenuProps } from "antd";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../authProvider";
import defaultProps from "./_defaultProps";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { push } = useRouter();
  const { isLogin,setIsLogin,userToken, setUserToken } = useContext(AuthContext);

  //检查登录状态，失效跳转到登录页
  useEffect(() => {
    if (!isLogin) {
      push("/login");
    }
  }, [isLogin]);


  //用户下拉菜单点击操作
  const onActionClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") {
      console.log("logout");
      logout();
    }
  };

  const logout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + userToken,
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();

        console.log("resp:", data);

        if (data.code == 200) {

          setIsLogin(false);
          setUserToken("");
        }
      } else {
        const data = await response.json();
      }
    } catch (error) {
    } finally {
    }
  };

  const [pathname, setPathname] = useState("/index");

  const settings: ProSettings | undefined = {
    layout: "mix",
  };
  return (
    <ProLayout
      title="MorTnon RouYi"
      logo="https://static.dongfangzan.cn/img/mortnon.svg"
      {...defaultProps}
      onMenuHeaderClick={(e) => console.log(e)}
      menuItemRender={(item, dom) => (
        <div
          onClick={() => {
            setPathname(item.path || "/index");
          }}
        >
          <Link href={item.path}>{dom}</Link>
        </div>
      )}
      location={{
        pathname,
      }}
      avatarProps={{
        src: "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg",
        size: "small",
        title: "Mortnon",
        render: (props, dom) => {
          return (
            <Dropdown
              menu={{
                items: [
                  {
                    key: "logout",
                    icon: <LogoutOutlined />,
                    label: "退出登录",
                  },
                ],
                onClick: onActionClick,
              }}
            >
              {dom}
            </Dropdown>
          );
        },
      }}
      actionsRender={(props) => {
        if (props.isMobile) return [];
        return [
          props.layout !== "side" ? (
            <div
              key="SearchOutlined"
              aria-hidden
              style={{
                display: "flex",
                alignItems: "center",
                marginInlineEnd: 24,
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <Input
                style={{
                  borderRadius: 4,
                  marginInlineEnd: 12,
                  backgroundColor: "rgba(0,0,0,0.03)",
                }}
                prefix={
                  <SearchOutlined
                    style={{
                      color: "rgba(0, 0, 0, 0.15)",
                    }}
                  />
                }
                placeholder="搜索方案"
                variant="borderless"
              />
              <PlusCircleFilled
                style={{
                  color: "var(--ant-primary-color)",
                  fontSize: 24,
                }}
              />
            </div>
          ) : undefined,
          <InfoCircleFilled key="InfoCircleFilled" />,
          <QuestionCircleFilled key="QuestionCircleFilled" />,
          <GithubFilled key="GithubFilled" />,
        ];
      }}
      menuFooterRender={(props) => {
        if (props?.collapsed) return undefined;
        return (
          <div
            style={{
              textAlign: "center",
              paddingBlockStart: 12,
            }}
          >
            <div>©{new Date().getFullYear()} Mortnon.</div>
          </div>
        );
      }}
      {...settings}
    >
      {children}
    </ProLayout>
  );
}
