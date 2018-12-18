import { request } from '../require.js'

export const getAllDegree = data => {
  return request({
  	method: 'get',
    url: '/browse/browseUsers',
    data
  })
}