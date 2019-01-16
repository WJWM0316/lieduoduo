import { request } from '../require.js'

// 职位列表
export const getPositionListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/position/list',
    data,
    hasLoading: hasLoading
  })
}

export const getPositionListNumApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/position/statustotal',
    data,
    hasLoading: hasLoading
  })
}

// 创建职位
export const createPositionApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: '/position',
    data,
    hasLoading: true
  })
}

// 获取职位信息
export const getPositionApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/position/${data.id}`,
    hasLoading: true
  })
}

// 编辑职位信息
export const editPositionApi = (data, hasLoading) => {
  return request({
    method: 'put',
    url: `/position/${data.id}`,
    data,
    hasLoading: true
  })
}

// 删除职位信息
export const deletePositionApi = (data, hasLoading) => {
  return request({
    method: 'put',
    url: `/position/${data.id}`,
    data,
    hasLoading: true
  })
}

// 获取经验数据列表
export const getPositionExperienceApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/position/experience',
    data,
    hasLoading: true
  })
}

// 关闭职位
export const closePositionApi = (data, hasLoading) => {
  return request({
    method: 'put',
    url: `/position/close/${data.id}`,
    data,
    hasLoading: true
  })
}

// 开放职位
export const openPositionApi = (data, hasLoading) => {
  return request({
    method: 'put',
    url: `/position/open/${data.id}`,
    data,
    hasLoading: true
  })
}

// 搜搜职位名称
export const getPositionNameListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/search/position`,
    data,
    hasLoading: true
  })
}