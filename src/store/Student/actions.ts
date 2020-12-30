/* eslint-disable */
import * as api from '@/api/student'

export default {
  async getStudentInfo ({ commit }: any) {
    const res = await api.getInfo()
    commit('setInfo', res.data)
  }
}
