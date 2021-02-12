/* eslint-disable @typescript-eslint/camelcase */

import * as api from './api'
import http from '@/util/http'
import { encodeToHttp } from '@/util/ende'

export function getInfo () {
  return http.get(api.getInfo)
}

export function addNewEnrol (description: string) {
  return http.post(api.addNewEnrol, {
    description
  })
}

export function changeEnrolDescription (id: number, description: string) {
  return http.put(`${api.addNewEnrol}/${id}`, {
    description
  })
}

export function deleteOneEnrol (id: number) {
  return http.delete(`${api.deleteOneEnrol}/${id}`)
}

export function getEnrols () {
  return http.get(api.getEnrols)
}

export function addNewDegree (description: string, enrol_id: number) {
  return http.post(api.addNewDegree, {
    description,
    enrol_id
  })
}

export function changeDegreeDescription (id: number, description: string) {
  return http.put(`${api.changeDegreeDescription}/${id}`, {
    description
  })
}

export function deleteDegree (id: number) {
  return http.delete(`${api.deleteDegree}/${id}`)
}

export function getDegrees () {
  return http.get(api.getDegrees)
}

export function addNewSource (description: string) {
  return http.post(api.addNewSource, {
    description
  })
}

export function changeSourceDescription (id: number, description: string) {
  return http.put(`${api.changeSourceDescription}/${id}`, {
    description
  })
}

export function deleteOneSource (id: number) {
  return http.delete(`${api.deleteOneSource}/${id}`)
}

export function getSources () {
  return http.get(api.getSources)
}

export function getSettings () {
  return http.get(api.getSettings)
}

export function insertOrUpdateSetting (key: string, value: string | number) {
  return http.put(api.insertOrUpdateSetting, {
    key,
    value: JSON.stringify({
      value
    })
  })
}

export function getFile (id: number) {
  return http.get(`${api.getFile}/${id}`)
}

export function deleteFile (id: number) {
  return http.get(`${api.deleteFile}/${id}`)
}

export function addBistudent (body: {
  username: string;
  password: string;
  name: string;
  recommended: number;
  score: number;
  graduation_university: string;
  graduation_major: string;
  household_register: string;
  ethnic: string;
  phone: string;
  gender: string;
  email: string;
  source: number;
  degree: number;
}) {
  body.password = encodeToHttp(body.password)
  return http.post(api.addBistudent, body)
}

export function addBistudents (body: {
  username: string;
  password: string;
  name: string;
  recommended: number;
  score: number;
  graduation_university: string;
  graduation_major: string;
  household_register: string;
  ethnic: string;
  phone: string;
  gender: string;
  email: string;
  source: number;
  degree: number;
}[]) {
  for (let i = 0; i < body.length; i++) {
    body[i].password = encodeToHttp(body[i].password)
  }
  return http.post(api.addBistudents, body)
}

export function changeBistudentInfo (id: number, body: {
  name: string;
  recommended: number;
  score: number;
  graduation_university: string;
  graduation_major: string;
  household_register: string;
  ethnic: string;
  phone: string;
  gender: string;
  email: string;
  source: number;
  degree: number;
}) {
  return http.put(`${api.changeBistudentInfo}/${id}`, body)
}

export function getAllBistudent (query: {
  pageSize: number;
  offset: number;
  username?: string;
  name?: string;
  enrol?: string;
  degree?: string;
  source?: string;
}) {
  const url = `${api.getAllBistudent}?pageSize=${query.pageSize}&offset=${query.offset}&username=${query.username || ''}&name=${query.name || ''}&enrol=${query.enrol || ''}&degree=${query.degree || ''}&source=${query.source || ''}`
  return http.get(url)
}

export function getBistudentCanSelectTeacher (id: number) {
  return http.get(`${api.getBistudentCanSelectTeacher}/${id}/teachers`)
}

export function getBistudentFiles (id: number) {
  return http.get(`${api.getBistudentFiles}/${id}/files`)
}

export function getBistudentSelectedTeacher (id: number) {
  return http.get(`${api.getBistudentSelectedTeacher}/${id}/teachers/selected`)
}

export function selectTeacherForStudent (bisid: number, tid: number) {
  return http.put(`${api.selectTeacherForStudent}/${bisid}/teacher/${tid}`)
}

export function deleteTeacherForStudent (bisid: number, tid: number) {
  return http.delete(`${api.deleteTeacherForStudent}/${bisid}/teacher/${tid}`)
}

export function deleteBistudent (bisid: number) {
  return http.delete(`${api.deleteBistudent}/${bisid}`)
}

export function getAllBiTeachers () {
  return http.get(api.getAllBiTeachers)
}

export function getOneBiTeacher (id: number) {
  return http.get(`${api.getOneBiTeacher}/${id}`)
}

export function getStudentsOfTeacher (id: number) {
  return http.get(`${api.getStudentsOfTeacher}/${id}/students`)
}

export function getTeacherEnrol (id: number) {
  return http.get(`${api.getTeacherEnrol}/${id}/enrols`)
}

export function getTeacherDegree (id: number) {
  return http.get(`${api.getTeacherDegree}/${id}/degrees`)
}

export function resetAllBiTeacherPassword (password: string) {
  const pass = encodeToHttp(password)
  return http.put(api.resetAllBiTeacherPassword, { pass })
}

export function addBiTeacher (info: {
  username: string;
  password: string;
  email: string;
  personal_page: string;
  research_area: string;
  enrols: {id: number; num: number}[];
  degrees: {id: number; num: number}[];
}) {
  const pass = encodeToHttp(info.password)
  return http.post(api.addBiTeacher, {
    ...info,
    password: pass
  })
}

export function changeTeacherInfo (id: number, body: {
  name: string;
  email: string;
  personal_page: string;
  research_area: string;
}) {
  return http.put(`${api.changeTeacherInfo}/${id}`, body)
}

export function changeTeacherPassword (id: number, password: string) {
  const pass = encodeToHttp(password)
  return http.put(`${api.changeTeacherPassword}/${id}/password`, {
    password: pass
  })
}

export function updateTeacherEnrols (id: number, enrols: { id: number; num: number }[]) {
  return http.put(`${api.updateTeacherEnrols}/${id}/enrols`, enrols)
}

export function updateTeacherDegrees (id: number, degrees: { id: number; num: number }[]) {
  return http.put(`${api.updateTeacherDegrees}/${id}/degrees`, degrees)
}

export function selectBistudentForTeacher (tid: number, bisid: number) {
  return http.put(`${api.selectBistudentForTeacher}/${tid}/bistudent/${bisid}`)
}

export function deleteBistudentForTeacher (tid: number, bisid: number) {
  return http.delete(`${api.deleteBistudentForTeacher}/${tid}/bistudent/${bisid}`)
}

export function getBistudentForTeacher (tid: number) {
  return http.get(`${api.getBistudentsForTeacher}/${tid}/bistudents`)
}

export function getTeacherSelectedBistudents (tid: number) {
  return http.get(`${api.getTeacherSelectedBistudents}/${tid}/bistudents/selected`)
}

export function getFilesCount () {
  return http.get(api.getFilesCount)
}

export function getBistudentsInfoBrief () {
  return http.get(api.getBriefStudentsInfo)
}
