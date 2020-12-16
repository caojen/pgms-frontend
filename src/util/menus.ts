// 用于layout.左侧栏的菜单
export default {
  notLogined: {
    when: false,
    default: ['/login'],
    openKeys: ['opened'],
    items: [{
      key: 'opened',
      icon: 'check',
      description: '管理系统',
      subItems: [{
        key: '/login',
        icon: 'user-add',
        description: '用户登录'
      }]
    }]
  },
  attendAdmin: {
    when: false,
    default: ['/admin/attend'],
    openKeys: ['opened'],
    items: [{
      key: 'opened',
      icon: 'snippets',
      description: '考勤管理',
      subItems: [{
        key: '/admin/attend',
        icon: 'user',
        description: '我的信息'
      }, {
        key: '/admin/attend/students',
        icon: 'smile',
        description: '学生信息'
      }, {
        key: '/admin/attend/teachers',
        icon: 'team',
        description: '老师信息'
      }, {
        key: '/admin/attend/records',
        icon: 'check-circle',
        description: '考勤信息'
      }, {
        key: '/admin/attend/lectures',
        icon: 'bar-chart',
        description: '讲座管理'
      }, {
        key: '/admin/attend/positions',
        icon: 'environment',
        description: '位置管理'
      }]
    }]
  }
}
