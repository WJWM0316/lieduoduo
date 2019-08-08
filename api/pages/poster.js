import { request } from '../require.js'

export const getRapidlyViweApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/rapidlyViwe',
    data,
    host: 'NODEHOST',
    hasLoading: hasLoading
  })
}