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
