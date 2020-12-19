import * as api from './api'
import http from '@/util/http'
import * as ende from '@/util/ende'

export function getUserStatus () {
  return http.get(api.currentUserStatus)
}

/**
 * user login with username and password
 * @param username
 * @param password
 */
export function login (username: string, password: string) {
  // encode password for http transition:
  const ePassword = ende.encodeToHttp(password)
  return http.post(api.userLogin, {
    username,
    password: ePassword
  })
}

/**
 * user logout
 */
export function logout () {
  return http.delete(api.userLogout)
}

/**
 * user change password
 * @param newpass
 */
export function changePassword (uid: number, newpass: string) {
  return http.put(api.changePassword, {
    newpassword: newpass
  })
}

export function loginWithToken (token: string) {
  return http.post(api.loginWithToken, {
    token
  })
}
