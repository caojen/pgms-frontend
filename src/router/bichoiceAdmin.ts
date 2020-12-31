export default [
  {
    path: '/admin/bichoice',
    name: 'BichoiceAdminHome',
    component: () => import('@/views/BichoiceAdmin/BichoiceAdminHome.vue')
  },
  {
    path: '/admin/bichoice/students',
    name: 'BichoiceAdminStudents',
    component: () => import('@/views/BichoiceAdmin/BichoiceAdminStudents.vue')
  },
  {
    path: '/admin/bichoice/enrols',
    name: 'BichoiceAdminEnrols',
    component: () => import('@/views/BichoiceAdmin/BichoiceAdminEnrols.vue')
  },
  {
    path: '/admin/bichoice/settings',
    name: 'BichoiceAdminSettings',
    component: () => import('@/views/BichoiceAdmin/BichoiceAdminSettings.vue')
  }
]
