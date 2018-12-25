import { request } from '../require.js'

export const getLabelPositionApi = (data, isLoading) => {
  return request({
    method: 'get',
    url: '/label/position',
    data,
    isLoading: true
  })
}