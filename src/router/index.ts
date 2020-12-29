import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Login from '@/views/Login.vue'
import LoginWithToken from '@/views/Token.vue'
import ForgetPassword from '@/views/ForgetPassword.vue'

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
    path: '/token',
    name: 'LoginWithToken',
    component: LoginWithToken
  },
  {
    path: '/find-pass',
    name: 'ForgetPassword',
    component: ForgetPassword
  },
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
  },
  {
    path: '/student',
    name: 'StudentHome',
    component: () => import('@/views/Student/StudentHome.vue')
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
