import axios from 'axios'
import { notification } from 'ant-design-vue'
import allowFailure from './allowFailure'

const baseURL = 'https://sdcsgraduate.sysu.edu.cn/newpgms/api'
const baseURLSize = baseURL.length

axios.defaults.baseURL = baseURL
axios.defaults.responseType = 'json'
axios.defaults.withCredentials = true

axios.interceptors.response.use(response => response, err => {
  if (!allowFailure(err.request.responseURL.substring(baseURLSize))) {
    notification.error({
      message: `请求失败（${err?.response?.status || '无网络'}）`,
      description: err?.response?.data?.message || err?.response?.data?.msg || '服务器未返回数据',
      class: 'error',
      duration: 6
    })
  }

  return Promise.reject(err.response.data || { msg: '请求失败' })
})

export default axios
