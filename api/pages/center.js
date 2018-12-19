// 个人中心接口
import { request } from '../require'
// 求职者个人基本信息
export const getBaseInfoApi = (isLoading) => {
  return request({
    method: 'get',
    url: '/jobhunter/baseInfo',
    isLoading: false
  })
}