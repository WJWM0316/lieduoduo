import {request} from '../require.js'

// 登录
export const getSessionKeyApi = (data, hasLoad = true) => {
  return request({
    url: '/wechat/oauth/mini',
    data,
    hasLoad: false
  })
}