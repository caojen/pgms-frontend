import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'

Vue.use(Vuex)

type StateType = typeof state;

export default {
  setInfo (state: StateType, info: {}) {
    Vue.set(state, 'info', info)
  },

  setTeacher (state: StateType, info: {}) {
    Vue.set(state, 'teacher', info)
  },

  setEmail (state: StateType, email: string) {
    Vue.set(state.info, 'email', email)
  }
}
