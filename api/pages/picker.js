import { request } from '../require.js'

export const getFinancingApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/company/financing',
    data,
    hasLoading: false
  })
}