/* 聚合接口 */
import { request } from '../require.js'
/* C端首页 筛选数据 */
export const getFilterDataApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/aggr/index',
    data,
    hasLoading: false
  })
}