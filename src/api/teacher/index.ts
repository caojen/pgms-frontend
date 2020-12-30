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
