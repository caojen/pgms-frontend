import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'
import attendAdmin from './AttendAdmin'
import student from './Student'
import teacher from './Teacher'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: {
    attendAdmin,
    student,
    teacher
  }
})
