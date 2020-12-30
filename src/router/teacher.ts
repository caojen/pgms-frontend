export default [
  {
    path: '/teacher',
    name: 'TeacherHome',
    component: () => import('@/views/Teacher/TeacherHome.vue')
  },
  {
    path: '/teacher/students',
    name: 'TeacherStudents',
    component: () => import('@/views/Teacher/TeacherStudents.vue')
  }
]
