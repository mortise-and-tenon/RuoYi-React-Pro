import {
    ChromeFilled,
    CrownFilled,
    SmileFilled,
    TabletFilled,
  } from '@ant-design/icons';

  export default {
    route: {
      path: '/',
      routes: [
        {
          path: '/index',
          name: '首页',
          icon: <SmileFilled />,
          component: './',
        },
        {
          path: '/admin',
          name: '系统管理',
          icon: <CrownFilled />,
          access: 'canAdmin',
          component: './Admin',
          routes: [
            {
              path: '/admin/user',
              name: '用户管理',
              icon: 'https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg',
              component: './admin/user',
            },
            {
              path: '/admin/role',
              name: '角色管理',
              icon: <CrownFilled />,
              component: './amin/role',
            },
            {
              path: '/admin/menu',
              name: '菜单管理',
              icon: <CrownFilled />,
              component: './menu',
            },
            {
                path: '/admin/depart',
                name: '部门管理',
                icon: <CrownFilled />,
                component: './depart',
              },
              {
                path: '/admin/position',
                name: '岗位管理',
                icon: <CrownFilled />,
                component: './position',
              },
          ],
        },
        {
          path: 'https://docs.bookhub.tech',
          name: 'BookHub 网站',
          icon: <ChromeFilled />,
        },
      ],
    },
  };