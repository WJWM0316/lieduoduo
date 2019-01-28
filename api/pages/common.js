// 通用接口api
import { request } from '../require'

export const unloadApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/cur/user_info',
    data,
    hasLoading: false
  })
}
export const upLoadApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: '/attaches',
    data,
    hasLoading: false
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
    url: '/label/professionalSkills'
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
// 保存求职者标签
export const saveLabelApi = (data) => {
  return request({
    method: 'post',
    data,
    url: '/jobhunter/labels'
  })
}
// 保存招聘官标签
export const saveRecruiterLabelApi = (data) => {
  return request({
    method: 'post',
    data,
    url: '/recruiter/label'
  })
}

// 行业领域列表
export const getLabelFieldApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/label/field',
    data,
    hasLoading: false
  })
}


// 删除附件
export const removeFileApi = (data, hasLoading) => {
  return request({
    method: 'delete',
    url: `/attaches/${data.id}`,
    data,
    hasLoading: false
  })
}

// 收集formID
export const formIdApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: `/wechat/mini/form_ids`,
    data,
    hasLoading: false
  })
}
