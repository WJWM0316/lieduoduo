import { request } from '../require.js'

// 获取招聘官所有招聘宣言
export const getRecruiterAllmanifestoApi = (data) => {
  return request({
    url: '/recruiter/allmanifesto',
    method: 'get',
    data,
    hasLoading: true
  })
}

// 招聘官-我的信息(“我的”页面)
export const getRecruiterMyInfoApi = (data) => {
  return request({
    url: '/recruiter/myInfo',
    method: 'get',
    data,
    hasLoading: true
  })
}

// 招聘官-我的信息(“我的”页面)
export const saveRecruiterInfoApi = (data) => {
  return request({
    url: '/recruiter/baseInfo',
    method: 'post',
    data,
    hasLoading: true
  })
}

// 招聘官-详情
export const getRecruiterDetailApi = (data) => {
  return request({
    url: `/recruiter/detail`,
    method: 'get',
    data,
    hasLoading: true
  })
}
export const getOthersRecruiterDetailApi = (data) => {
  return request({
    url: `/recruiter/detail/uid/${data.uid}`,
    method: 'get',
    data,
    hasLoading: true
  })
}

// 招聘官打call
export const giveMecallApi = (data) => {
  return request({
    url: `/recruiter/callRecruiter/${data.vkey}`,
    method: 'put',
    data,
    hasLoading: true
  })
}
