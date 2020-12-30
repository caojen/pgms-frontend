import * as api from './api'
import http from '@/util/http'

export function getInfo () {
  return http.get(api.currentUser)
}
