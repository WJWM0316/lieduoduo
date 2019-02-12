import { request } from '../require.js'

// 用户申请加入公司
export const applyCompanyApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: '/company/apply',
    data,
    hasLoading: true
  })
}

// 用户编辑申请加入公司
export const editApplyCompanyApi = (data, hasLoading) => {
  return request({
    method: 'put',
    url: `/company/apply/${data.id}`,
    data,
    hasLoading: true
  })
}

// 获取融资数据列表
export const getCompanyFinancingApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/company/financing',
    data,
    hasLoading: true
  })
}

// 获取员工数据列表
export const getCompanyEmployeesApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/company/employees',
    data,
    hasLoading: true
  })
}

// 填写身份信息
export const identityCompanyApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: '/company/identity',
    data,
    hasLoading: true
  })
}

// 创建公司
export const createCompanyApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: '/company',
    data,
    hasLoading: true
  })
}

// 获取公司信息
export const getCompanyInfosApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/company/${data.id}`,
    hasLoading: true
  })
}

// 编辑公司信息
export const editCompanyInfosApi = (data, hasLoading) => {
  return request({
    method: 'put',
    url: `/company/temp/${data.id}`,
    data,
    hasLoading: true
  })
}

// 删除公司
export const deleteCompanyApi = (data, hasLoading) => {
  return request({
    method: 'delete',
    url: `/company/${data.id}`,
    hasLoading: true
  })
}

// 通过公司名判断公司是否存在
export const JustifyCompanyExistApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/company/${data.name}`,
    hasLoading: true
  })
}

// 编辑公司相册
export const editCompanyAlbumApi = (data, hasLoading) => {
  return request({
    method: 'put',
    url: `/company/album/${data.id}`,
    data,
    hasLoading: true
  })
}

// 添加公司地址
export const addCompanyAddressApi = (data, hasLoading) => {
  return request({
    method: 'put',
    url: `/company/address/${data.id}`,
    data,
    hasLoading: true
  })
}

// 添加职位地址
export const addPositionAddressApi = (data, hasLoading) => {
  return request({
    method: 'put',
    url: `/company/position/address`,
    data,
    hasLoading: true
  })
}

// 修改公司地址
export const editCompanyAddressApi = (data, hasLoading) => {
  return request({
    method: 'put',
    url: `/company/addressedit/${data.id}`,
    data,
    hasLoading: true
  })
}

// 修改职位地址
export const editPositionAddressApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: `/company/position/address/${data.id}`,
    data,
    hasLoading: true
  })
}

// 删除职位地址
export const deletePositionAddressApi = (data, hasLoading) => {
  return request({
    method: 'delete',
    url: `/company/position/address/${data.id}`,
    hasLoading: true
  })
}

// 删除公司地址
export const deleteCompanyAddressApi = (data, hasLoading) => {
  return request({
    method: 'delete',
    url: `/company/address/${data.id}`,
    hasLoading: true
  })
}

// 获取公司地址列表
export const getCompanyAddressListApi = (data, hasLoading) => {
  const id = data.id
  delete data.id
  return request({
    method: 'get',
    url: `/company/addresslist/${id}`,
    data,
    hasLoading: true
  })
}

// 获取职位地址列表
export const getPositionAddressListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/company/position/simplepage/addresses`,
    data,
    hasLoading: true
  })
}

// 获取地址详情
export const getAddressDetailApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/company/position/address/${data.id}`,
    hasLoading: true
  })
}

// 获取职位地址详情
export const getPositionAddressDetailApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/company/position/address/${data.id}`,
    hasLoading: true
  })
}

// 获取公司地址详情
export const getCompanyAddressDetailApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/company/address/${data.id}`,
    hasLoading: true
  })
}

// 创建公司产品
export const createCompanyProductApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: '/company/product',
    data,
    hasLoading: true
  })
}

// 获取公司产品信息
export const getCompanyProductInfosApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/company/product/${data.id}`,
    hasLoading: true
  })
}

// 编辑公司产品信息
export const editCompanyProductInfosApi = (data, hasLoading) => {
  return request({
    method: 'put',
    url: `/company/product/${data.id}`,
    data,
    hasLoading: true
  })
}

// 删除公司产品信息
export const deleteCompanyProductInfosApi = (data, hasLoading) => {
  return request({
    method: 'delete',
    url: `/company/product/${data.id}`,
    hasLoading: true
  })
}

// 获取公司产品列表
export const getCompanyProductListsApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/company/productlist/${data.id}`,
    data,
    hasLoading: true
  })
}

// 获取身份信息
export const getCompanyIdentityInfosApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/company/identity`,
    hasLoading: true
  })
}

// 编辑身份信息
export const editCompanyIdentityInfosApi = (data, hasLoading) => {
  return request({
    method: 'put',
    url: `/company/identity`,
    data,
    hasLoading: true
  })
}

// 删除身份信息
export const deleteCompanyIdentityInfosApi = (data, hasLoading) => {
  return request({
    method: 'delete',
    url: `/company/identity/${data.id}`,
    hasLoading: true
  })
}

// 搜索公司
export const getCompanyNameListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/search/company_name`,
    data,
    hasLoading: true
  })
}

// 分页招聘团队
export const getRecruitersListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/company/recruiters/${data.id}`,
    data,
    hasLoading: true
  })
}

// 发送邮箱
export const sendEmailApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: `/company/mail`,
    data,
    hasLoading: true
  })
}

// 验证企业邮箱验证码
export const verifyEmailApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: `/company/verify`,
    data,
    hasLoading: true
  })
}

// 编辑公司部分信息
export const putCompanyInfoApi = (data, hasLoading) => {
  return request({
    method: 'put',
    url: `/company/part/${data.id}`,
    data,
    hasLoading: true
  })
}

// 编辑公司简介
export const putCompanyBriefApi = (data, hasLoading) => {
  return request({
    method: 'put',
    url: `/company/intro/${data.id}`,
    data,
    hasLoading: true
  })
}
// 通过公司名判断公司是否存在
export const justifyCompanyExistApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/company/exist/${data.name}`,
    hasLoading: true
  })
}

// 判断公司信息是否完善
export const getCompanyPerfectApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/company/perfect/${data.id}`,
    hasLoading: true
  })
}
