// axios基础的封装
import axios from 'axios'
import { Message } from '@arco-design/web-vue'
import { useAuthStore } from '@/stores/auth'
const httpInstance = axios.create({
  baseURL: 'http://localhost:4120/api',
  timeout: 5000
})

// axios请求拦截器
httpInstance.interceptors.request.use(config => {
  // 1. 从pinia获取token数据
  const userStore = useAuthStore()
  // 2. 按照后端的要求拼接token数据
  const token = userStore.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, e => Promise.reject(e))

// axios响应式拦截器
httpInstance.interceptors.response.use(res => res.data, e => {
  // 统一错误提示
  Message.error(e.response.data.message)
  return Promise.reject(e)
})

export default httpInstance