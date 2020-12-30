/* eslint-diable */

import * as api from '@/api/bichoiceAdmin'

export default {
  async getBichoiceAdminInfo ({ commit }: any) {
    api.getInfo()
      .then(res => {
        const data = res.data
        const id = data.admin.id
        const name = data.admin.name
        commit('setName', name)
        commit('setId', id)
      })
  }
}
