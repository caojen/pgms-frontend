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
  },
  {
    path: '/admin/bichoice/sources',
    name: 'BichoiceAdminSources',
    component: () => import('@/views/BichoiceAdmin/BichoiceAdminSources.vue')
  },
  {
    path: '/admin/bichoice/degrees',
    name: 'BichoiceAdminDegrees',
    component: () => import('@/views/BichoiceAdmin/BichoiceAdminDegrees.vue')
  },
  {
    path: '/admin/bichoice/teachers',
    name: 'BichoiceAdminTeachers',
    component: () => import('@/views/BichoiceAdmin/BichoiceAdminTeachers.vue')
  },
  {
    path: '/admin/bichoice/files',
    name: 'BichoiceAdminFiles',
    component: () => import('@/views/BichoiceAdmin/BichoiceAdminFiles.vue')
  }
]
