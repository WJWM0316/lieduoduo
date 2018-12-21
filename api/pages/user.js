import { request } from '../require.js'

export const getUserInfoApi = (data, isLoading) => {
  return request({
    method: 'get',
    url: '/cur/user_info',
    data,
    isLoading: false
  })
}

// 用户申请加入公司
export const applyCompanyApi = (data, isLoading) => {
  return request({
    method: 'post',
    url: '/company/apply',
    data,
    isLoading: false
  })
}

// 获取融资数据列表
export const getCompanyFinancingApi = (data, isLoading) => {
  return request({
    method: 'get',
    url: '/company/financing',
    data,
    isLoading: false
  })
}

// 获取员工数据列表
export const getCompanyEmployeesApi = (data, isLoading) => {
  return request({
    method: 'get',
    url: '/company/employees',
    data,
    isLoading: false
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