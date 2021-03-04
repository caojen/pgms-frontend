import * as api from './api'
import http from '@/util/http'

export const url = api

export function getBichoiceInfo () {
  return http.get(api.getBichoiceInfo)
}

export function getBistudentInfo () {
  return http.get(api.getBistudentInfo)
}

export function updateBistudentInfo (info: {
  phone: string;
  email: string;
}) {
  return http.put(api.updateBistudentInfo, info)
}

export function getAllTeachers () {
  return http.get(api.getAllTeachers)
}

export function selectOneTeacher (tid: number) {
  return http.put(`${api.selectOneTeacher}/${tid}`)
}

export function deleteOneTeacher (tid: number) {
  return http.delete(`${api.deleteOneTeacher}/${tid}`)
}

export function getFile (fid: number) {
  return http.get(`${api.getFile}/${fid}`, {
    responseType: 'blob'
  })
}

export function postFile (file: Blob) {
  const formData = new FormData()
  formData.append('file', file)
  return http.post(api.postFile, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export function updateImage (file: Blob) {
  const formData = new FormData()
  formData.append('file', file)
  return http.post(api.updateImage, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export function deleteFile (fid: number) {
  return http.delete(`${api.deleteFile}/${fid}`)
}

export function getFileList () {
  return http.get(api.getFileList)
}

export function orderUp (index: number) {
  return http.put(`${api.orderUp}/${index}`)
}

export function orderDown (index: number) {
  return http.put(`${api.orderDown}/${index}`)
}
