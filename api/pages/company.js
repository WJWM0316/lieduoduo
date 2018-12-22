import { request } from '../require.js'

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

// 填写身份信息
export const identityCompanyApi = (data, isLoading) => {
  return request({
    method: 'post',
    url: '/company/identity',
    data,
    isLoading: false
  })
}