export default [
  {
    path: '/bistudent',
    name: 'BistudentHome',
    component: () => import('@/views/Bistudent/BistudentHome.vue')
  },
  {
    path: '/bistudent/info',
    name: 'BistudentInfo',
    component: () => import('@/views/Bistudent/BistudentInfo.vue')
  },
  {
    path: '/bistudent/file',
    name: 'BistudentFile',
    component: () => import('@/views/Bistudent/BistudentFile.vue')
  },
  {
    path: '/bistudent/teacher',
    name: 'BistudentTeacher',
    component: () => import('@/views/Bistudent/BistudentTeacher.vue')
  }
]
