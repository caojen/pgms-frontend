// 用于layout.左侧栏的菜单
export default {
  notLogined: {
    when: false,
    default: ['/login'],
    items: [{
      key: '/login', // key：指定这个menu-item将要跳转到的位置
      icon: 'user-add',
      description: '用户登录',
      goto: '/login' // 未使用
    }]
  }
}
