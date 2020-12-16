import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
  isLogined (state: { username: string }): boolean {
    const islogin = !state.username
    return islogin
  }
}
