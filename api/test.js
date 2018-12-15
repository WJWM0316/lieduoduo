import { request } from './require.js'

export const getAllDegree = data => {
  return request({
  	method: 'get',
    url: '/degree/all',
    data
  })
}