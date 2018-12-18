import { request } from '../require.js'

export const getSessionKeyApi = (data, isLoading) => {
  return request({
    url: '/wechat/oauth/mini',
    data,
    isLoading: false
  })
}

export const loginApi = data => {
  return request({
  	method: 'post',
    url: '/wechat/login/mini',
    data
  })
}