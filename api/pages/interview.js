import { request } from '../require.js'
// 招聘官撩约接口
export const inviteInterviewApi = (data, isLoading) => {
  return request({
    method: 'post',
    url: '/interview/inviteInterview',
    data
  })
}
// 求职端面试详情
export const interviewDetailApi = (data, isLoading) => {
  return request({
    method: 'get',
    url: `/interview/detail/${data.interviewId}`,
    data
  })
}
