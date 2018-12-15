import { request } from './require.js'

export const loginApi = data => {
  return request({
  	method: 'post',
    url: '/auth/login',
    data
  })
}