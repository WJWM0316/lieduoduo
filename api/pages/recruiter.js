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
