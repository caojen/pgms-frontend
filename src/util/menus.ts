export const openKeys = ['opened']
export const defaultSelected = [
  '/login',
  '/admin/attend'
]

const notLogined = {
  when: false,
  subMenu: {
    key: 'opened',
    icon: 'check',
    description: '管理系统',
    subItems: [{
      key: '/login',
      icon: 'user-add',
      description: '用户登录'
    }, {
      key: '/find-pass',
      icon: 'block',
      description: '忘记密码'
    }, {
      key: '/token',
      icon: 'unlock',
      description: 'Token'
    }]
  }
}

const attendAdmin = {
  when: false,
  subMenu: {
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
  }
}

const contact = {
  when: true,
  subMenu: {
    key: 'closed',
    icon: 'phone',
    description: '联系我们',
    subItems: [{
      key: '/contact',
      icon: 'contacts',
      description: '联系方式'
    }, {
      key: '/contact/bug',
      icon: 'bug',
      description: 'Bug报告'
    }, {
      key: '/contact/feedback',
      icon: 'rollback',
      description: '反馈意见'
    }]
  }
}

export const menus = [
  notLogined,
  attendAdmin,
  contact
]

export const indexMap = {
  notLogined: 0,
  attendAdmin: 1,
  contact: 2
}
