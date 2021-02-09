/* eslint-disable @typescript-eslint/camelcase */

import * as api from './api'
import http from '@/util/http'

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
  return http.get(`${api.getBistudentFiles}/${id}`)
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
