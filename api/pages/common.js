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
export const upLoadApi = (data, isLoading) => {
  return request({
    method: 'post',
    url: '/attaches',
    data,
    isLoading: false
  })
}
// 职位列表数据接口
export const getPostionApi = (data) => {
  return request({
    method: 'get',
    data,
    url: '/label/positionType'
  })
}
// 职位标签接口
export const getJobLabelApi = (data) => {
  return request({
    method: 'get',
    data,
    url: '/label/position'
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
    url: '/label/professionalSkills'
  })
}
// 创建生活标签接口
export const addLifeLabelApi = (data) => {
  return request({
    method: 'post',
    data,
    url: '/label/life'
  })
}
export const saveLabelApi = (data) => {
  return request({
    method: 'post',
    data,
    url: '/jobhunter/labels'
  })
}

// 行业领域列表
export const getLabelFieldApi = (data, isLoading) => {
  return request({
    method: 'get',
    url: '/label/field',
    data,
    isLoading: false
  })
}