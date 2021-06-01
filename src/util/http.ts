import axios from 'axios'
import { notification } from 'ant-design-vue'
import allowFailure from './allowFailure'

const baseURL = 'https://sdcsgraduate.sysu.edu.cn/newpgms/api' // 后端api前缀
// const baseURL = 'http://10.8.11.136/newpgms/api'

export const prefix = baseURL

const baseURLSize = baseURL.length

axios.defaults.baseURL = baseURL
axios.defaults.responseType = 'json'
axios.defaults.withCredentials = true

axios.interceptors.response.use(response => response, err => {
  // 在这里统一处理异常
  if (!allowFailure(err.request.responseURL.substring(baseURLSize))) {
    notification.error({
      message: `请求失败（${err?.response?.status || '无连接'}）`,
      description: err?.response?.data?.message || err?.response?.data?.msg || err?.response?.data || '服务器未返回数据',
      class: 'error',
      duration: 6
    })
  }

  // 将异常继续交给路由层处理
  return Promise.reject(err.response.data || { msg: '请求失败' })
})

export default axios
