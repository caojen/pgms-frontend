/* eslint-disable */
import * as api from '@/api/student'

export default {
  async getStudentInfo ({ commit }: any) {
    const res = await api.getInfo()
    commit('setInfo', res.data.student)
  },

  async getStudentTeacher ({ commit }: any) {
    const res = await api.getTeacher()
    commit('setTeacher', res.data)
  },

  async studentChangeEmail ({ commit }: any, email: string) {
    await api.changeEmail(email)
    commit('setEmail', email)
  }
}
