import * as userApi from '@/api/user/api'

// 数组下的api不会提示报错信息
const allowApis = [
  userApi.currentUserStatus
]

export default function allowFailure (url: string): boolean {
  return allowApis.indexOf(url) !== -1
}
