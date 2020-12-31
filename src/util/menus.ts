export const openKeys = ['opened', 'opened1']
export const defaultSelected = [
  '/login',
  '/admin/attend',
  '/student',
  '/teacher'
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

const student = {
  when: false,
  subMenu: {
    key: 'opened',
    icon: 'check',
    description: '考勤系统',
    subItems: [{
      key: '/student',
      icon: 'user',
      description: '我的信息'
    }, {
      key: '/student/records',
      icon: 'check-circle',
      description: '签到情况'
    }, {
      key: '/student/lectures',
      icon: 'bar-chart',
      description: '讲座概览'
    }]
  }
}

const attendTeacher = {
  when: false,
  subMenu: {
    key: 'opened',
    icon: 'check',
    description: '考勤系统',
    subItems: [{
      key: '/teacher',
      icon: 'user',
      description: '我的信息'
    }, {
      key: '/teacher/students',
      icon: 'team',
      description: '我的学生'
    }, {
      key: '/teacher/records',
      icon: 'check-circle',
      description: '考勤情况'
    }, {
      key: '/teacher/lectures',
      icon: 'bar-chart',
      description: '讲座情况'
    }]
  }
}

const bichoiceTeacher = {
  when: false,
  subMenu: {
    key: 'opened1',
    icon: 'check',
    description: '双选系统',
    subItems: [{
      key: '/teacher/bichoice',
      icon: 'info-circle',
      description: '双选概述'
    }, {
      key: '/teacher/bistudent',
      icon: 'usergroup-add',
      description: '选择学生'
    }]
  }
}

const contact = {
  when: false,
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

const bichoiceAdmin = {
  when: false,
  subMenu: {
    key: 'opened',
    icon: 'check',
    description: '双选系统',
    subItems: [{
      key: '/admin/bichoice',
      icon: 'user',
      description: '我的信息'
    }, {
      key: '/admin/bichoice/enrols',
      icon: 'bars',
      description: 'Enrol设置'
    }, {
      key: '/admin/bichoice/degrees',
      icon: 'bars',
      description: 'Degree设置'
    }, {
      key: '/admin/bichoice/sources',
      icon: 'bars',
      description: 'Source设置'
    }, {
      key: '/admin/bichoice/students',
      icon: 'team',
      description: '查看学生'
    }, {
      key: '/admin/bichoice/teachers',
      icon: 'audit',
      description: '查看老师'
    }, {
      key: '/admin/bichoice/settings',
      icon: 'setting',
      description: '变量设置'
    }, {
      key: '/admin/bichoice/summary',
      icon: 'dot-chart',
      description: '统计情况'
    }]
  }
}

export const menus = [
  notLogined,
  attendAdmin,
  contact,
  student,
  attendTeacher,
  bichoiceTeacher,
  bichoiceAdmin
]

export const indexMap = {
  notLogined: 0,
  attendAdmin: 1,
  contact: 2,
  student: 3,
  attendTeacher: 4,
  bichoiceTeacher: 5,
  bichoiceAdmin: 6
}
