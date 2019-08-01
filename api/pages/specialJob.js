import { request } from '../require.js'

// 获取招聘官所有招聘宣言
export const getRapidlyApi = (data) => {
  return request({
    url: '/surface/rapidly',
    host: 'NODEHOST',
    method: 'get',
    data
  })
}