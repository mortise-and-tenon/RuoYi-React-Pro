"use client";
import { Tooltip } from "@/node_modules/antd/es/index";
import {
  GithubOutlined,
  LogoutOutlined,
  QuestionCircleFilled,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { ProSettings } from "@ant-design/pro-components";
import { ProLayout } from "@ant-design/pro-components";
import { deleteCookie, getCookie } from "cookies-next";

import { Dropdown, Input, MenuProps } from "antd";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import defaultProps from "./_defaultProps";

import { UserInfo } from "../_modules/definies";
import "./styles.css";
import { AuthHeader } from "../_modules/func";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { push } = useRouter();

  const redirectToLogin = () => {
    push("/login");
  };

  const [userToken,setUserToken] = useState("");

  //检查登录状态，失效跳转到登录页
  useEffect(() => {
    const token = getCookie("token");
    setUserToken(token);
    
    if (token === "") {
      redirectToLogin();
    }
    getProfile();
  }, []);

  //是否展示搜索框
  const [showSearch, setShowSearch] = useState(false);

  //用户下拉菜单点击操作
  const onActionClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") {
      console.log("logout");
      logout();
    } else if (key === "profile") {
      console.log("profile");
      push("/user/profile");
    }
  };

  //用户昵称
  const [userInfo, setUserInfo] = useState({
    nickName: "Monrtnon",
    avatar: "/avatar1.jpeg",
  } as UserInfo);

  //获取用户信息
  const getProfile = async () => {
    try {
      const response = await fetch("/api/getInfo", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + userToken,
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();

        if (data.code == 200) {
          const userInfo: UserInfo = {
            nickName: data.user.nickName,
            avatar: data.user.sex === "1" ? "https://imgs.bookhub.tech/avatar/avatar1.jpeg" : "https://imgs.bookhub.tech/avatar/avatar0.jpeg",
          };

          setUserInfo(userInfo);
        }
      } else {
        const data = await response.json();
      }
    } catch (error) {
    } finally {
    }
  };

  //退出登录
  const logout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          Authorization: AuthHeader(userToken),
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();

        if (data.code == 200) {
          deleteCookie("token");
          redirectToLogin();
        }
      } else {
        const data = await response.json();
      }
    } catch (error) {
    } finally {
    }
  };

  //默认当前展示首页
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
        src: `${userInfo.avatar}`,
        size: "small",
        title: `${userInfo.nickName}`,
        render: (props, dom) => {
          return (
            <Dropdown
              menu={{
                items: [
                  {
                    key: "profile",
                    icon: <UserOutlined />,
                    label: "个人中心",
                  },
                  {
                    type: "divider",
                  },
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
              }}
              onMouseDown={(e) => {
                console.log("search click");
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <SearchOutlined
                style={{
                  color: "var(--ant-primary-color)",
                }}
                onClick={() => setShowSearch(!showSearch)}
              />
              {showSearch && (
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
                  placeholder="搜索"
                  variant="borderless"
                />
              )}
            </div>
          ) : undefined,
          <Link
            key="github"
            href="https://github.com/mortise-and-tenon/RuoYi-React-Pro"
            target="_blank"
          >
            <Tooltip title="Github 源码仓库">
              <GithubOutlined style={{ color: "gray" }} />
            </Tooltip>
          </Link>,
          <Link
            key="question"
            href="https://doc.ruoyi.vip/ruoyi-vue/"
            target="_blank"
          >
            <Tooltip title="RuoYi 文档">
              <QuestionCircleFilled style={{ color: "gray" }} />
            </Tooltip>
          </Link>,
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
