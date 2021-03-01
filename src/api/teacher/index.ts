/* eslint-disable @typescript-eslint/camelcase */
import * as api from './api'
import http from '@/util/http'

export function getInfo () {
  return http.get(api.getInfo)
}

export function getStudents () {
  return http.get(api.getStudents)
}

export function getRecords (id: number, pageSize: number, offset: number) {
  return http.get(`${api.getRecords}/${id}?pageSize=${pageSize}&offset=${offset}`)
}

export function getLectures (pageSize: number, offset: number) {
  return http.get(`${api.getLectures}?pageSize=${pageSize}&offset=${offset}`)
}

export function updateInfo (info: {
  email: string;
  personal_page: string;
  research_area: string;
}) {
  return http.put(`${api.updateInfo}`, info)
}

export function getEnrols () {
  return http.get(api.getEnrols)
}

export function getDegrees () {
  return http.get(api.getDegrees)
}

export function getStatus () {
  return http.get(api.getStatus)
}

export function getBistudents () {
  return http.get(api.getBistudents)
}

export function getSelectedBistudents () {
  return http.get(api.getSelectedBistudents)
}

export function selectBistudents (id: number) {
  return http.put(`${api.selectBistudents}/${id}`)
}

export function deleteBistudents (id: number) {
  return http.delete(`${api.deleteBistudents}/${id}`)
}

export function getFileListOfBistudents (id: number) {
  return http.get(`${api.getFileListOfBistudents}/${id}/files`)
}

export function getOneFile (bisid: number, fid: number) {
  return http.get(`${api.getOneFile}/${bisid}/file/${fid}`)
}
