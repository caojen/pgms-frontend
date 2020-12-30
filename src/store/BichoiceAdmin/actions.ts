/* eslint-disable */

import * as api from '@/api/bichoiceAdmin'

export default {
  async getBichoiceAdminInfo ({ commit }: any) {
    const res = await api.getInfo()
    const data = res.data
    const id = data.admin.id
    const name = data.admin.name
    commit('setName', name)
    commit('setId', id)
  },

  async getEnrols ({ commit }: any) {
    const res = await api.getEnrols()
    const data = res.data
    commit('setEnrols', data)
  },

  async getDegrees ({ commit }: any) {
    const res = await api.getDegrees()
    const data = res.data
    commit('setDegrees', data)
  },

  async getSources ({ commit }: any) {
    const res = await api.getSources()
    const data = res.data
    commit('setSources', data)
  }
}
