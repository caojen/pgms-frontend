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
    const students = data.students.map((s: {
      username: string | undefined;
      user: {
        username: string;
      }
    }) => {
      s['username'] = s.user.username
      return s
    })
    commit('setStudents', students)
  },
  
  async queryTeacherByName ({ commit }: any, name: string) {
    const res = await api.queryTeacherByName(name)
    const data = res.data

    console.log('getdata', data)

    commit('setQueryTeachers', data)
  }
}
