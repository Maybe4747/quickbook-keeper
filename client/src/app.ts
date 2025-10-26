// 运行时配置

import { UserInfo } from './services/typings';
import { history } from '@umijs/max';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate

// 运行时路由配置
export function onRouteChange({ location, routes, action }: any) {
  // 检查是否需要登录
  const token = localStorage.getItem('token');
  const publicPaths = ['/login', '/register']; // 公共路径，不需要登录
  
  if (!token && !publicPaths.includes(location.pathname)) {
    // 如果没有token且访问非公共路径，跳转到登录页
    if (location.pathname !== '/login') {
      history.push('/login');
    }
  }
}

export const layout = () => {
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
  };
};
