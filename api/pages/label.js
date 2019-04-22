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

// 技能标签
export const getProfessionalSkillsApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/label/professionalSkills',
    data,
    hasLoading: true
  })
}

// 公司亮点标签
export const getTeamlightspotApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/lightspot/list',
    data,
    hasLoading: true
  })
}

// 添加自定义亮点标签
export const diyTeamlabApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: '/lightspot/diylab',
    data,
    hasLoading: true
  })
}

// 添加自定义亮点标签
export const saveTeamlabApi = (data, hasLoading) => {
  return request({
    method: 'put',
    url: '/lightspot/save',
    data,
    hasLoading: true
  })
}

// 搜索职位列表
export const getLabelLIstsApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/search/position',
    data,
    hasLoading: true
  })
}

// 获取热门职位列表
export const getHotLabelLIstsApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/label/position/hot',
    data,
    hasLoading: true
  })
}
