import { request } from '../require.js'

// 在线约面
export const getRapidlyViwePostApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/rapidlyViwe',
    data,
    host: 'NODEHOST',
    hasLoading: hasLoading
  })
}

// 职位长图
export const getPositionPostApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/position',
    data,
    host: 'NODEHOST',
    hasLoading: hasLoading
  })
}

// 精美职位
export const getPositionMinPostApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/position_min',
    data,
    host: 'NODEHOST',
    hasLoading: hasLoading
  })
}

// 简历
export const getResumePostApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/resume',
    data,
    host: 'NODEHOST',
    hasLoading: hasLoading
  })
}

// 招聘官
export const getRecruiterPostApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/recruiter',
    data,
    host: 'NODEHOST',
    hasLoading: hasLoading
  })
}

// 10要你节
export const getWantYouApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/wantYou',
    data,
    host: 'NODEHOST',
    hasLoading: hasLoading
  })
}

// 精致派
export const getDelicateApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/delicate',
    data,
    host: 'NODEHOST',
    hasLoading: hasLoading
  })
}
