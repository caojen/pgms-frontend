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
  },
  setPagination (state: StateType, pagination: {
    total: string;
    current: string;
    pageSize: string;
  }) {
    Vue.set(state, 'pagination', pagination)
  },
  setStudents (state: StateType, students: {}[]) {
    Vue.set(state, 'students', students)
  },
  setQueryTeachers (state: StateType, teachers: {}[]) {
    Vue.set(state, 'queryTeachers', teachers)
  }
}
