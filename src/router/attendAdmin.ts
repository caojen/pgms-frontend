export default [
  {
    path: '/admin/attend',
    name: 'AttendAdminHome',
    component: () => import('@/views/AttendAdmin/AttendAdminHome.vue')
  },
  {
    path: '/admin/attend/students',
    name: 'AttendAdminStudents',
    component: () => import('@/views/AttendAdmin/AttendAdminStudents.vue')
  },
  {
    path: '/admin/attend/teachers',
    name: 'AttendAdminTeachers',
    component: () => import('@/views/AttendAdmin/AttendAdminTeachers.vue')
  },
  {
    path: '/admin/attend/positions',
    name: 'AttendAdminPositions',
    component: () => import('@/views/AttendAdmin/AttendAdminPositions.vue')
  },
  {
    path: '/admin/attend/lectures',
    name: 'AttendAdminLectures',
    component: () => import('@/views/AttendAdmin/AttendAdminLectures.vue')
  },
  {
    path: '/admin/attend/records',
    name: 'AttendAdminRecords',
    component: () => import('@/views/AttendAdmin/AttendAdminRecords.vue')
  }
]
