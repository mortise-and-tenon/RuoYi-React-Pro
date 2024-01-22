"use client";
import { Tooltip } from "@/node_modules/antd/es/index";
import {
  GithubOutlined,
  LogoutOutlined,
  QuestionCircleFilled,
  SearchOutlined,
  UserOutlined,
  HomeOutlined,
  ChromeFilled,
  MenuOutlined,
  MonitorOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import type { ProSettings } from "@ant-design/pro-components";
import { PageContainer, ProLayout } from "@ant-design/pro-components";
import { deleteCookie, getCookie } from "cookies-next";

import { Dropdown, Input, MenuProps } from "antd";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import defaultProps from "./_defaultProps";

import { RouteInfo, UserInfo } from "../_modules/definies";
import "./styles.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { push } = useRouter();

  async function fetchApi(url: string, options?: RequestInit) {
    const token = getCookie("token");
    const authHeader = {
      Authorization: "Bearer " + token,
    };

    const requestHeader = {
      ...options?.headers,
      ...authHeader,
      credentials: "include",
    };

    const requestOptions = {
      ...options,
      headers: requestHeader,
    };

    const response = await fetch(url, requestOptions);

    try {
      const body = await response.json();
      if (response.ok) {
        if (body.code == 401) {
          push("/login");
          return;
        }
      }

      return body;
    } catch (error) {
      console.log("fetch error:", error);
    }
  }

  const redirectToLogin = () => {
    push("/login");
  };

  const [userToken, setUserToken] = useState("");

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
    avatar: "https://images.bookhub.tech/avatar/avatar1.jpeg",
  } as UserInfo);

  //获取用户信息
  const getProfile = async () => {
    const data = await fetchApi("/api/getInfo");

    if (data !== undefined) {
      const userInfo: UserInfo = {
        nickName: data.user.nickName,
        avatar:
          data.user.sex === "1"
            ? "https://images.bookhub.tech/avatar/avatar1.jpeg"
            : "https://images.bookhub.tech/avatar/avatar0.jpeg",
      };

      setUserInfo(userInfo);
    }
  };

  const IconMap = {
    system: <HomeOutlined />,
    monitor:<MonitorOutlined />,
    toole: <ToolOutlined />,
    guide: <ChromeFilled/>,
    user: <UserOutlined />,
    
  };

  //获取菜单
  const getRoutes = async () => {
    const body = await fetchApi("/api/getRouters");
    const rootChildren: Array<RouteInfo> = new Array<RouteInfo>();
    if (body.data && body.data.length > 0) {
      body.data.forEach((menu) => {
        const route: RouteInfo = {
          path: menu.meta.link !== null ? menu.meta.link : menu.path,
          name: menu.meta.title,
          icon: menu.meta.icon !== null ? IconMap[menu.meta.icon as 'system'] : <MenuOutlined />,
        };

        if (menu.children && menu.children.length > 0) {
          getSubMenu(route, menu.children);
        }
        rootChildren.push(route);

      });

    }

    const bookHub:RouteInfo = {
      path: "https://docs.bookhub.tech",
      name: "BookHub 网站",
      icon: <ChromeFilled/>,
    }

    console.log("menu:",rootChildren);

    rootChildren.push(bookHub);

    return rootChildren;
  };

  const getSubMenu = (parent: RouteInfo, menuChildren) => {
    const routeChildren: Array<RouteInfo> = new Array<RouteInfo>();
    menuChildren.forEach((menu) => {
      const route: RouteInfo = {
        path: menu.meta.link !== null ? menu.meta.link : menu.component,
        name: menu.meta.title,
        icon: menu.meta.icon !== null ? IconMap[menu.meta.icon as 'system'] : <MenuOutlined />,
      };
      routeChildren.push(route);

      if (menu.children && menu.children.length > 0) {
        getSubMenu(route, menu.children);
      }
    });

    parent.routes = routeChildren;
  };

  //退出登录
  const logout = async () => {
    const data = await fetchApi("/api/logout", {
      method: "POST",
    });

    if (data.code == 200) {
      deleteCookie("token");
      redirectToLogin();
    }
  };

  //默认当前展示首页
  const [pathname, setPathname] = useState("/index");

  //侧边菜单样式
  const settings: ProSettings | undefined = {
    layout: "mix",
    splitMenus: false,
    defaultCollapsed: false,
    breakpoint: false,
  };

  return (
    <ProLayout
      title="MorTnon RouYi"
      logo="https://static.dongfangzan.cn/img/mortnon.svg"
      menu={{
        request: getRoutes,
      }}
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
      <PageContainer>{children}</PageContainer>
    </ProLayout>
  );
}
