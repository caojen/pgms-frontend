import Login from '@/views/Login.vue'
import LoginWithToken from '@/views/Token.vue'
import ForgetPassword from '@/views/ForgetPassword.vue'

export default [
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
  }
]
