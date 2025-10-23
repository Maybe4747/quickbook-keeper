import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '随手记账',
  },
  routes: [
    {
      name: '登录',
      path: '/login',
      component: './Login',
      layout: false,
      hideInMenu: true,
    },
    {
      name: '注册',
      path: '/register',
      component: './Register',
      layout: false,
      hideInMenu: true,
    },
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
      icon: 'home',
    },
    {
      name: '账单列表',
      path: '/bills',
      component: './BillList',
      icon: 'profile',
    },
    {
      name: '新增账单',
      path: '/bills/new',
      component: './BillForm',
      icon: 'plus',
    },
    {
      name: '编辑账单',
      path: '/bills/edit/:id',
      component: './BillForm',
      hideInMenu: true,
    },
    {
      name: '分类管理',
      path: '/categories',
      component: './Categories',
      icon: 'appstore',
    },
    {
      name: '个人中心',
      path: '/profile',
      component: './UserProfile',
      icon: 'user',
    },
  ],
  npmClient: 'pnpm',
});
