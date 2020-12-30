export default [
  {
    path: '/admin/bichoice',
    name: 'BichoiceAdminHome',
    component: () => import('@/views/BichoiceAdmin/BichoiceAdminHome.vue')
  },
  {
    path: '/admin/bichoice/students',
    bane: 'BichoiceAdminStudents',
    component: () => import('@/views/BichoiceAdmin/BichoiceAdminStudents.vue')
  }
]
