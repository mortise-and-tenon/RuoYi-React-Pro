import {
  ChromeFilled,
  CrownFilled,
  SmileFilled,
  TabletFilled,
  HomeOutlined
} from "@ant-design/icons";

export default {
  route: {
    path: "/",
    routes: [
      {
        path: "/index",
        name: "首页",
        icon: <HomeOutlined />,
      },
      {
        path: "/admin",
        name: "系统管理",
        icon: <CrownFilled />,
        access: "canAdmin",
        routes: [
          {
            path: "/admin/user",
            name: "用户管理",
            icon: "https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg",
          },
          {
            path: "/admin/role",
            name: "角色管理",
            icon: <CrownFilled />,
          },
          {
            path: "/admin/menu",
            name: "菜单管理",
            icon: <CrownFilled />,
          },
          {
            path: "/admin/depart",
            name: "部门管理",
            icon: <CrownFilled />,
          },
          {
            path: "/admin/position",
            name: "岗位管理",
            icon: <CrownFilled />,
          },
          {
            path: "/admin/dic",
            name: "字典管理",
            icon: <CrownFilled />,
          },
          {
            path: "/admin/repo",
            name: "仓库管理",
            icon: <CrownFilled />,
          },
          {
            path: "/admin/notice",
            name: "通知公告",
            icon: <CrownFilled />,
          },
          {
            path: "/admin/log",
            name: "日志管理",
            icon: <CrownFilled />,
            routes: [
              {
                path: "/admin/oplog",
                name: "操作日志",
                icon: <CrownFilled />,
              },
              {
                path: "/admin/loginlog",
                name: "登录日志",
                icon: <CrownFilled />,
              },
            ],
          },
        ],
      },
      {
        path: "/monitor",
        name: "系统监控",
        icon: <CrownFilled />,
        routes: [
          {
            path: "/monitor/user",
            name: "在线用户",
            icon: <CrownFilled />,
          },
          {
            path: "/monitor/task",
            name: "定时任务",
            icon: <CrownFilled />,
          },
          {
            path: "/monitor/data",
            name: "数据监控",
            icon: <CrownFilled />,
          },
          {
            path: "/monitor/service",
            name: "服务监控",
            icon: <CrownFilled />,
          },
          {
            path: "/monitor/cache",
            name: "缓存监控",
            icon: <CrownFilled />,
          },
          {
            path: "/monitor/cachelist",
            name: "缓存列表",
            icon: <CrownFilled />,
          },
        ],
      },
      {
        path: "/system",
        name: "系统工㮂",
        icon: <CrownFilled />,
        routes: [
          {
            path: "/system/table",
            name: "表单构建",
            icon: <CrownFilled />,
          },
          {
            path: "/system/code",
            name: "代码生成",
            icon: <CrownFilled />,
          },
          {
            path: "/system/inter",
            name: "系统接口",
            icon: <CrownFilled />,
          },
        ],
      },
      {
        path: "https://docs.bookhub.tech",
        name: "BookHub 网站",
        icon: <ChromeFilled />,
      },
    ],
  },
};
