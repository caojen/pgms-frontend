import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Login from '@/views/Login.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
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
    path: '*',
    name: '404-Page',
    component: () => import('@/views/components/404.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
