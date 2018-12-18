// 通用接口api
import { request } from '../require'

export const unloadApi = (data, isLoading) => {
  return request({
    method: 'get',
    url: '/cur/user_info',
    data,
    isLoading: false
  })
}
