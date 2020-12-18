/* eslint-disable @typescript-eslint/camelcase */
import * as api from './api'
import http from '@/util/http'
import * as ende from '@/util/ende'

export function getInfo () {
  return http.get(api.getInfo)
}

export function getAllAttendStudent (
  pageSize: number,
  offset: number,
  queryName: string,
  queryUsername: string
) {
  return http.get(
    `${api.getAllAttendStudent}?pageSize=${pageSize}&offset=${offset}&queryName=${queryName}&queryUsername=${queryUsername}`
  )
}

export function addOneAttendStudent (
  username: string,
  password: string,
  name: string,
  email: string,
  teacher: number, // teacher's id
  student_id: string
) {
  return http.post(api.addOneAttendStudent, {
    username,
    password: ende.encodeToHttp(password),
    email,
    name,
    teacher,
    student_id
  })
}

export function addManyAttendStudents (students: {
  username: string;
  password: string;
  name: string;
  email: string;
  student_id: string;
  teacher_username: string;
}[]) {
  return http.post(api.addManyAttendStudents, students)
}

/**
 * @param id student's id
 */
export function deleteOneStudent (id: number) {
  return http.delete(`${api.deleteOneStudent}/${id}`)
}

/**
 * @param id student's id
 */
export function changePasswordForStudent (id: number, password: string) {
  return http.put(`${api.changePasswordForStudent}/${id}/password`, {
    password: ende.encodeToHttp(password)
  })
}

/**
 * @param id student's id
 */
export function updateStudentInfo (id: number, info: {
  email: string;
  student_id: string;
  name: string;
}) {
  return http.put(`${api.updateStudentInfo}/${id}`, info)
}

/**
 * @param id student' id
 * @param tid teacher's id
 */
export function updateStudentTeacher (id: number, tid: number) {
  return http.put(`${api.updateStudentTeacher}/${id}/teacher/${tid}`)
}

export function queryTeacherByName (name: string) {
  return http.get(`${api.queryTeacherByName}?name=${name}`)
}

export function insertOneTeacher (body: {
  username: string;
  password: string;
  name: string;
  email: string;
  personal_page: string;
  research_area: string;
}) {
  return http.post(api.insertOneTeacher, body)
}

export function updateOneTeacher (tid: number, body: {
  name: string;
  research_area: string;
  personal_page: string;
  email: string;
}) {
  return http.post(`${api.updateOneTeacher}/${tid}`, body)
}

export function getOneTeacherInfo (tid: number) {
  return http.get(`${api.getOneTeacherInfo}/${tid}`)
}

export function getAllTeachers () {
  return http.get(api.getAllTeachers)
}

export function deleteOneTeacher (tid: number) {
  return http.delete(`${api.deleteOneTeacher}/${tid}`)
}

export function changePasswordForTeacher (tid: number, newPass: string) {
  const ePass = ende.encodeToHttp(newPass)
  return http.put(`${api.changePasswordForTeacher}/${tid}`, {
    password: ePass
  })
}

export function resetAllPasswordForTeacher (password: string) {
  const ePass = ende.encodeToHttp(password)
  return http.put(api.resetAllPasswordForTeacher, {
    password: ePass
  })
}
