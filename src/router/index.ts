import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import beforeLogin from './beforeLogin'
import globalRouter from './global'
import attendAdmin from './attendAdmin'
import student from './student'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/login'
  },
  ...beforeLogin,
  ...globalRouter,
  ...attendAdmin,
  ...student,
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
