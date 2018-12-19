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
export const getJobLabelApi = (isLoading) => {
  return request({
    method: 'get',
    url: '/label/positionType',
    isLoading: false
  })
}
// 城市标签
export const getCityLabelApi = (isLoading) => {
  return request({
    method: 'get',
    url: '/area/hotArea',
    isLoading: false
  })
}