import { request } from '../require.js'

export const getUserInfoApi = (data, isLoading) => {
  return request({
    method: 'get',
    url: '/cur/user_info',
    data,
    isLoading: false
  })
}

export const postFormIdApi = (data, isLoading) => {
  return request({
    method: 'post',
    url: '/wechat/mini/formIds',
    data,
    isLoading: false
  })
}