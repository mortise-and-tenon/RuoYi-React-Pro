"use client";
import {
  ApiOutlined,
  BookOutlined,
  ChromeFilled,
  CodeOutlined,
  EditOutlined,
  GithubOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuOutlined,
  MessageOutlined,
  MonitorOutlined,
  QuestionCircleFilled,
  SearchOutlined,
  ToolOutlined,
  UserOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import type { ProSettings } from "@ant-design/pro-components";
import { ProLayout, ProConfigProvider } from "@ant-design/pro-components";
import { deleteCookie, getCookie } from "cookies-next";
import { Dropdown, Input, MenuProps, Tooltip, Modal } from "antd";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  faAddressCard,
  faBookAtlas,
  faChalkboardUser,
  faDatabase,
  faDesktop,
  faFileWaveform,
  faGear,
  faList,
  faLocationArrow,
  faMemory,
  faReceipt,
  faRectangleList,
  faSitemap,
  faTableCells,
  faThumbtack,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RouteInfo, UserInfo, IconMap } from "../_modules/definies";
import "./styles.css";

import { displayModeIsDark, fetchApi, watchDarkModeChange } from "../_modules/func";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { push } = useRouter();

  const redirectToLogin = () => {
    push("/login");
  };

  //深色模式
  const [isDark, setIsDark] = useState(false);

  //检查登录状态，失效跳转到登录页
  useEffect(() => {
    const token = getCookie("token");

    if (token === "") {
      redirectToLogin();
      return;
    }
    getProfile();

    setIsDark(displayModeIsDark());
    const unsubscribe = watchDarkModeChange((matches: boolean) => {
      setIsDark(matches);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  //是否展示搜索框
  const [showSearch, setShowSearch] = useState(false);

  //是否展示退出对话框
  const [isLogoutShow, setIsLogoutShow] = useState(false);
  //是否加载中
  const [confirmLoading, setConfirmLoading] = useState(false);

  //用户下拉菜单点击操作
  const onActionClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") {
      setIsLogoutShow(true);
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
    const data = await fetchApi("/api/getInfo", push);

    if (data !== undefined) {
      const userInfo: UserInfo = {
        nickName: data.user.nickName,
        avatar:
          data.user.avatar === ""
            ? data.user.sex === "1"
              ? "/avatar1.jpeg"
              : "/avatar0.jpeg"
            : "/api" + data.user.avatar,
      };

      setUserInfo(userInfo);
    }
  };

  //获取菜单
  const getRoutes = async () => {
    const body = await fetchApi("/api/getRouters", push);
    const rootChildren: Array<RouteInfo> = new Array<RouteInfo>();

    const indexRoute: RouteInfo = {
      path: "/home",
      name: "首页",
      icon: <HomeOutlined />,
    };

    rootChildren.push(indexRoute);

    if (body.data && body.data.length > 0) {
      body.data.forEach((menu: any) => {
        const route: RouteInfo = {
          path: menu.path,
          name: menu.meta.title,
          icon:
            menu.meta.icon !== null ? (
              IconMap[menu.meta.icon.replace(/-/g, "") as "system"]
            ) : (
              <MenuOutlined />
            ),
        };

        if (menu.children && menu.children.length > 0) {
          getSubMenu(route, menu.children);
        }
        rootChildren.push(route);
      });
    }

    const bookHub: RouteInfo = {
      path: "https://docs.bookhub.tech",
      name: "BookHub 网站",
      icon: <ChromeFilled />,
    };

    rootChildren.push(bookHub);

    console.log("menu:", rootChildren);
    return rootChildren;
  };

  const getSubMenu = (parent: RouteInfo, menuChildren: any) => {
    const routeChildren: Array<RouteInfo> = new Array<RouteInfo>();
    menuChildren.forEach((menu: any) => {
      const route: RouteInfo = {
        path: menu.path,
        name: menu.meta.title,
        icon:
          menu.meta.icon !== null ? (
            IconMap[menu.meta.icon.replace(/-/g, "") as "system"]
          ) : (
            <MenuOutlined />
          ),
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
    setConfirmLoading(true);
    const data = await fetchApi("/api/logout", push, {
      method: "POST",
    });

    if (data.code == 200) {
      deleteCookie("token");
      redirectToLogin();
      setIsLogoutShow(false);
      setConfirmLoading(false);
    }
  };

  //默认当前展示首页
  const pathName = usePathname();
  const [pathname, setPathname] = useState(pathName);

  return (
    <ProConfigProvider dark={isDark}>
      <ProLayout
        title="MorTnon 若依"
        logo="https://static.dongfangzan.cn/img/mortnon.svg"
        menu={{
          request: getRoutes,
        }}
        layout="mix"
        splitMenus={false}
        defaultCollapsed={false}
        breakpoint={false}
        onMenuHeaderClick={(e) => console.log(e)}
        menuItemRender={(item, dom) => {
          let shouldRenderIcon =
            item.pro_layout_parentKeys && item.pro_layout_parentKeys.length > 0;
          return (
            <div
              onClick={() => {
                setPathname(item.path || "/index");
              }}
            >
              <Link href={item.path !== undefined ? item.path : ""}>
                {shouldRenderIcon ? (
                  <span style={{ display: "flex", alignItems: "center" }}>
                    {item.icon}
                    <span style={{ marginLeft: "8px" }}>{dom}</span>
                  </span>
                ) : (
                  dom
                )}
              </Link>
            </div>
          );
        }}
        subMenuItemRender={(item, dom) => {
          let shouldRenderIcon =
            item.pro_layout_parentKeys && item.pro_layout_parentKeys.length > 0;
          return (
            <>
              {shouldRenderIcon ? (
                <span style={{ display: "flex", alignItems: "center" }}>
                  {item.icon}
                  <span style={{ marginLeft: "8px" }}>{dom}</span>
                </span>
              ) : (
                dom
              )}
            </>
          );
        }}
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
              style={{ padding: "0 6px" }}
              key="github"
              href="https://github.com/mortise-and-tenon/RuoYi-React-Pro"
              target="_blank"
            >
              <Tooltip title="Github 源码仓库">
                <GithubOutlined style={{ color: "gray" }} />
              </Tooltip>
            </Link>,
            <Link
              style={{ padding: "0 6px" }}
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
      >
        <Modal
          title={
            <>
              <ExclamationCircleFilled style={{ color: "#faad14" }} /> 提示
            </>
          }
          open={isLogoutShow}
          onOk={logout}
          onCancel={() => setIsLogoutShow(false)}
          confirmLoading={confirmLoading}
        >
          确定注销并退出系统吗？
        </Modal>
        {children}
      </ProLayout>
    </ProConfigProvider>
  );
}
