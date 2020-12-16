/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
import * as api from '@/api/user'
import { userLogout } from '@/api/user/api'

Vue.use(Vuex)

function determineUserType(data: any): string {
  if (!!data['admin']) {
    return 'admin'
  } else if (!!data['student']) {
    return 'student'
  } else if (!!data['bistudent']) {
    return 'bistudent'
  } else if (!!data['teacher']) {
    return 'teacher'
  } else {
    return ''
  }
}

export default {
  async getUserStatus({ commit }: any) {
    try {
      const res = await api.getUserStatus()
      if(!!res) {
        commit('setUsername', res.data.username)
        commit('setUid', res.data.uid)
        const usertype = determineUserType(res.data)
        commit('setUsertype', usertype)
        if (usertype === 'admin') {
          commit('setAdmintype', res.data.admin.type || '')
        }
      }
    } catch {
      commit('setUsername', '')
    }
  },
  async login ({ commit }: any, { username, password }: any) {
    const res = await api.login(username, password)
    if (!!res) {
      commit('setUsername', username)
      commit('setUid', res.data.uid)
      const usertype = determineUserType(res.data)
      commit('setUsertype', usertype)
      if (usertype === 'admin') {
        commit('setAdmintype', res.data.admin.type || '')
      }
    }
  },
  async userLogout({ commit }: any) {
    await api.logout();
    // 无论如何，直接退出
    commit('setUsername', '')
    commit('setUid', '')
    commit('setUsertype', '')
    commit('setAdmintype', '')
  }
}
