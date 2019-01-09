import { request } from '../require.js'

export const getLabelPositionApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/label/position',
    data,
    hasLoading: true
  })
}

export const getLabelProfessionalSkillsApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/label/professionalSkills?type=skills',
    data,
    hasLoading: true
  })
}

// 省市区列表接口
export const getAreaListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/area',
    data,
    hasLoading: true
  })
}

// 行业领域
export const getFieldListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/label/field',
    data,
    hasLoading: true
  })
}

// 职业类别
export const getPositionTypeApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/label/positionType',
    data,
    hasLoading: true
  })
}
