// 通用接口api
import { request } from '../require'

export const unloadApi = (data, isLoading) => {
  return request({
    method: 'get',
    url: '/cur/user_info',
    data,
    isLoading: false
  })
}
// 职位标签接口
export const getJobLabelApi = (data) => {
  return request({
    method: 'get',
    data,
    url: '/label/positionType'
  })
}
// 生活标签接口
export const getLifeLableApi = (data) => {
  return request({
    method: 'get',
    data,
    url: '/label/life'
  })
}
// 城市标签
export const getCityLabelApi = (data) => {
  return request({
    method: 'get',
    data,
    url: '/area/hotArea',
  })
}
// 创建职位标签接口
export const addJobLabelApi = (data) => {
  return request({
    method: 'post',
    data,
    url: '/label/positionType'
  })
}
