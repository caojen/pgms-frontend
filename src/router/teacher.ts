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
    name: 'TeacherLectures',
    component: () => import('@/views/Teacher/TeacherLectures.vue')
  },
  {
    path: '/teacher/bichoice',
    name: 'TeacherBichoice',
    component: () => import('@/views/Teacher/TeacherSummary.vue')
  },
  {
    path: '/teacher/bistudent',
    name: 'TeacherBistudents',
    component: () => import('@/views/Teacher/TeacherBichoice.vue')
  }
]
