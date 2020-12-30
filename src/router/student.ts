export default [
  {
    path: '/student',
    name: 'StudentHome',
    component: () => import('@/views/Student/StudentHome.vue')
  },
  {
    path: '/student/records',
    name: 'StudentRecords',
    component: () => import('@/views/Student/StudentRecords.vue')
  }
]
