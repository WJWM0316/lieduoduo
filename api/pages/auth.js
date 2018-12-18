import { request } from '../require.js'

export const getSessionKeyApi = (data, hasLoading) => {
  return request({
    url: '/wechat/oauth/mini',
    data,
    hasLoading: false
  })
}

export const loginApi = data => {
  return request({
  	method: 'post',
    url: '/wechat/login/mini',
    data
  })
}

export const testLoginApi = data => {
  return request({
    method: 'post',
    url: '/auth/login',
    data
  })
}

