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
  },
  {
    path: '/teacher/records',
    name: 'TeacherRecords',
    component: () => import('@/views/Teacher/TeacherRecords.vue')
  },
  {
    path: '/teacher/lectures',
    name: 'TeacherRecords',
    component: () => import('@/views/Teacher/TeacherLectures.vue')
  }
]
