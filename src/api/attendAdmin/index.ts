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
  return http.put(`${api.updateOneTeacher}/${tid}`, body)
}

export function getOneTeacherInfo (tid: number) {
  return http.get(`${api.getOneTeacherInfo}/${tid}`)
}

export function getAllTeachers (pageSize: number, offset: number, name: string, username: string) {
  return http.get(`${api.getAllTeachers}?pageSize=${pageSize}&offset=${offset}&name=${name}&username=${username}`)
}

export function deleteOneTeacher (tid: number) {
  return http.delete(`${api.deleteOneTeacher}/${tid}`)
}

export function changePasswordForTeacher (tid: number, newPass: string) {
  const ePass = ende.encodeToHttp(newPass)
  return http.put(`${api.changePasswordForTeacher}/${tid}/password`, {
    password: ePass
  })
}

export function resetAllPasswordForTeacher (password: string) {
  const ePass = ende.encodeToHttp(password)
  return http.put(api.resetAllPasswordForTeacher, {
    password: ePass
  })
}

export function getAllPositions () {
  return http.get(api.getAllPositions)
}

export function changeOnePosition (pid: number, body: {
  description: string;
  device: string;
}) {
  return http.put(`${api.changeOnePosition}/${pid}`, body)
}

export function addOnePosition (body: {
  description: string;
  device: string;
}) {
  return http.post(api.addOnePosition, body)
}

export function deleteOnePosition (pid: number) {
  return http.delete(`${api.deleteOnePosition}/${pid}`)
}

export function addOneLecture (body: {
  title: string;
  content: string;
  positions: number[];
  start: Date;
  end: Date;
}) {
  return http.post(api.addOneLecture, body)
}

export function deleteOneLecture (lid: number) {
  return http.delete(`${api.deleteOneLecture}/${lid}`)
}

export function getAllLectures (query: {
  pageSize: number;
  offset: number;
}) {
  return http.get(`${api.getAllLectures}?pageSize=${query.pageSize}&offset=${query.offset}`)
}

export function updateOneLecture (lid: number, body: {
  title: string;
  content: string;
  positions: number[];
  start: Date;
  end: Date;
}) {
  return http.put(`${api.getAllLectures}/${lid}`, body)
}
