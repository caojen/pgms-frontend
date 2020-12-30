import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
  isLogined (state: { username: string }): boolean {
    const islogin = !!state.username
    return islogin
  },
  isAttendAdmin (state: { admintype: string }): boolean {
    const isAttendAdmin = state.admintype === 'attend'
    return isAttendAdmin
  },
  isStudent (state: { usertype: string }): boolean {
    const isStudent = state.usertype === 'student'
    return isStudent
  },
  isTeacher (state: { usertype: string }): boolean {
    const isTeacher = state.usertype === 'teacher'
    return isTeacher
  },
  isBichoiceAdmin (state: { admintype: string }): boolean {
    const isBichoiceAdmin = state.admintype === 'bichoice'
    return isBichoiceAdmin
  }
}
