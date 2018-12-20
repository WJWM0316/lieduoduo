import { request } from '../require.js'

export const applyCompanyApi = (data, isLoading) => {
  return request({
    method: 'post',
    url: '/company/apply',
    data,
    isLoading: false
  })
}

