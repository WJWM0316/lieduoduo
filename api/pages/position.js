import { request } from '../require.js'

// 职位列表
export const getPositionListApi = (data, isLoading) => {
  return request({
    method: 'get',
    url: '/position/list',
    data,
    isLoading: false
  })
}

// 创建职位
export const createPositionApi = (data, isLoading) => {
  return request({
    method: 'post',
    url: '/position',
    data,
    isLoading: false
  })
}

// 获取职位信息
export const getPositionApi = (data, isLoading) => {
  return request({
    method: 'get',
    url: `/position/${data.id}`,
    data,
    isLoading: false
  })
}

// 编辑职位信息
export const editPositionApi = (data, isLoading) => {
  return request({
    method: 'put',
    url: `/position/${data.id}`,
    data,
    isLoading: false
  })
}

// 删除职位信息
export const deletePositionApi = (data, isLoading) => {
  return request({
    method: 'put',
    url: `/position/${data.id}`,
    data,
    isLoading: false
  })
}

// 获取经验数据列表
export const getPositionExperienceApi = (data, isLoading) => {
  return request({
    method: 'get',
    url: '/position/experience',
    data,
    isLoading: false
  })
}

// 关闭职位
export const closePositionApi = (data, isLoading) => {
  return request({
    method: 'put',
    url: `/position/close/${data.id}`,
    data,
    isLoading: false
  })
}

// 关闭职位
export const openPositionApi = (data, isLoading) => {
  return request({
    method: 'put',
    url: `/position/open/${data.id}`,
    data,
    isLoading: false
  })
}

// 搜搜职位名称
export const getPositionNameListApi = (data, isLoading) => {
  return request({
    method: 'get',
    url: `/position/namelist`,
    data,
    isLoading: false
  })
}