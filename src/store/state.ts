import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
  uid: 0, // 登录用户对应的user.id
  username: '', // 登录用户的登录账号
  usertype: '', // 登录用户的用户类型: enum { admin, teacher, student, bistudent }
  admintype: '' // 管理员的类型: enum { attend, bichoice, '' }
}
