import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'

Vue.use(Vuex)

type StateType = typeof state;

export default {
  setUsername (state: StateType, username: string) {
    Vue.set(state, 'username', username)
  },
  setUid (state: StateType, uid: number) {
    Vue.set(state, 'uid', uid)
  },
  setUsertype (state: StateType, usertype: string) {
    Vue.set(state, 'usertype', usertype)
  },
  setAdmintype (state: StateType, admintype: string) {
    Vue.set(state, 'admintype', admintype)
  }
}
