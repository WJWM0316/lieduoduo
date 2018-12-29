import { request } from '../require.js'

// 用户申请加入公司
export const applyCompanyApi = (data, isLoading) => {
  return request({
    method: 'post',
    url: '/company/apply',
    data,
    isLoading: true
  })
}

// 获取融资数据列表
export const getCompanyFinancingApi = (data, isLoading) => {
  return request({
    method: 'get',
    url: '/company/financing',
    data,
    isLoading: true
  })
}

// 获取员工数据列表
export const getCompanyEmployeesApi = (data, isLoading) => {
  return request({
    method: 'get',
    url: '/company/employees',
    data,
    isLoading: true
  })
}

// 填写身份信息
export const identityCompanyApi = (data, isLoading) => {
  return request({
    method: 'post',
    url: '/company/identity',
    data,
    isLoading: true
  })
}

// 创建公司
export const createCompanyApi = (data, isLoading) => {
  return request({
    method: 'post',
    url: '/company',
    data,
    isLoading: true
  })
}

// 获取公司信息
export const getCompanyInfosApi = (data, isLoading) => {
  return request({
    method: 'get',
    url: `/company/${data.id}`,
    isLoading: true
  })
}

// 编辑公司信息
export const editCompanyInfosApi = (data, isLoading) => {
  return request({
    method: 'put',
    url: `/company/${data.id}`,
    data,
    isLoading: true
  })
}

// 删除公司
export const deleteCompanyApi = (data, isLoading) => {
  return request({
    method: 'delete',
    url: `/company/${data.id}`,
    isLoading: true
  })
}

// 通过公司名判断公司是否存在
export const JustifyCompanyExistApi = (data, isLoading) => {
  return request({
    method: 'get',
    url: `/company/${data.name}`,
    isLoading: true
  })
}

// 编辑公司相册
export const editCompanyAlbumApi = (data, isLoading) => {
  return request({
    method: 'put',
    url: `/company/${data.name}`,
    isLoading: true
  })
}

// 添加公司地址
export const addCompanyAddressApi = (data, isLoading) => {
  return request({
    method: 'put',
    url: `/company/${data.id}`,
    data,
    isLoading: true
  })
}

// 创建公司产品
export const createCompanyProductApi = (data, isLoading) => {
  return request({
    method: 'post',
    url: '/company/product',
    data,
    isLoading: true
  })
}

// 获取公司产品信息
export const getCompanyProductInfosApi = (data, isLoading) => {
  return request({
    method: 'get',
    url: `/company/product/${data.id}`,
    isLoading: true
  })
}

// 编辑公司产品信息
export const editCompanyProductInfosApi = (data, isLoading) => {
  return request({
    method: 'put',
    url: `/company/product/${data.id}`,
    data,
    isLoading: true
  })
}

// 删除公司产品信息
export const deleteCompanyProductInfosApi = (data, isLoading) => {
  return request({
    method: 'delete',
    url: `/company/product/${data.id}`,
    data,
    isLoading: true
  })
}

// 获取身份信息
export const getCompanyIdentityInfosApi = (data, isLoading) => {
  return request({
    method: 'get',
    url: `/company/identity/${data.id}`,
    isLoading: true
  })
}

// 获取身份信息
export const editCompanyIdentityInfosApi = (data, isLoading) => {
  return request({
    method: 'put',
    url: `/company/identity/${data.id}`,
    data,
    isLoading: true
  })
}

// 删除身份信息
export const deleteCompanyIdentityInfosApi = (data, isLoading) => {
  return request({
    method: 'delete',
    url: `/company/identity/${data.id}`,
    isLoading: true
  })
}