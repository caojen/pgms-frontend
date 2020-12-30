/* eslint-disable */
import * as api from '@/api/teacher'

export default {
  async getTeacherInfo ({ commit }: any) {
    const res = await api.getInfo()
    commit('setInfo', res.data.teacher)
  }
}
