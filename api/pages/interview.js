import { request } from '../require.js'
// 招聘官撩约接口
export const inviteInterviewApi = (data, isLoading) => {
  return request({
    method: 'post',
    url: '/interview/inviteInterview',
    data
  })
}