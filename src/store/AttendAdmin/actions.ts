/* eslint-disable */
import * as api from '@/api/attendAdmin'

export default {
  async getAttendAdminInfo ({ commit }: any) {
    const userInfo = await api.getInfo()
    const data = userInfo.data
    commit('setName', data.admin?.name || '')
    commit('setId', data.admin?.id || 0)
  }
}
