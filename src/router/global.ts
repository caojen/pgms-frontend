export default [
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/views/Contact.vue')
  },
  {
    path: '/contact/bug',
    name: 'Bug',
    component: () => import('@/views/Bugs.vue')
  },
  {
    path: '/contact/feedback',
    name: 'Feedback',
    component: () => import('@/views/Feedback.vue')
  }
]
