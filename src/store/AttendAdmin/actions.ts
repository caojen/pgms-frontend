/* eslint-disable */
import * as api from '@/api/attendAdmin'

export default {
  async getAttendAdminInfo ({ commit }: any) {
    const userInfo = await api.getInfo()
    const data = userInfo.data
    commit('setName', data.admin?.name || '')
    commit('setId', data.admin?.id || 0)
  },

  async getAllAttendStudents ({ commit }: any, {
    pageSize,
    offset,
    queryName,
    queryUsername
  }: any) {
    const res = await api.getAllAttendStudent(pageSize, offset, queryName, queryUsername)
    const data = res.data
    const count = data.count

    commit('setPagination', {
      total: count,
      current: offset + 1,
      pageSize
    })
    const students = []
    for (let i = 0; i < data.students.length; i++) {
      students.push({
        ...data.students[i],
        username: data.students[i].user.username
      })
    }
    commit('setStudents', students)
  },
  
  async queryTeacherByName ({ commit }: any, name: string) {
    const res = await api.queryTeacherByName(name)
    const data = res.data

    commit('setQueryTeachers', data)
  }
}
