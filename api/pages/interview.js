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

// 招聘端面试安排设置
export const setInterviewDetailApi = (data, isLoading) => {
  return request({
    method: 'post',
    url: `/interview/setInterviewInfo/${data.interviewId}`,
    data
  })
}

// 开撩约面
export const applyInterviewApi = (data, isLoading) => {
  return request({
    method: 'post',
    url: '/interview/applyInterview',
    data
  })
}

// 求职端确认面试安排
export const sureInterviewApi = (data, isLoading) => {
  return request({
    method: 'post',
    url: `/interview/confirmArrangementInfo/${data.interviewId}`,
    data
  })
}

//求职者申请列表
export const getApplyListApi = (data, isLoading) => {
  return request({
    method: 'get',
    url: '/interview/apply',
    data
  })
}

//收到邀请列表
export const getInviteListApi = (data, isLoading) => {
  return request({
    method: 'get',
    url: '/interview/invite',
    data
  })
}

//收到邀请列表
export const getScheduleListApi = (data, isLoading) => {
  return request({
    method: 'get',
    url: '/interview/schedule',
    data
  })
}
