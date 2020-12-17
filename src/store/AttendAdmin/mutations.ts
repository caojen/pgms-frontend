import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'

Vue.use(Vuex)

type StateType = typeof state;

export default {
  setName (state: StateType, name: string) {
    Vue.set(state, 'name', name)
  },
  setId (state: StateType, id: number) {
    Vue.set(state, 'id', id)
  }
}
