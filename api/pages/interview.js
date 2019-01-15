import { request } from '../require.js'

// 招聘官撩约接口
export const inviteInterviewApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: '/interview/inviteInterview',
    data
  })
}

// 求职端面试详情
export const interviewDetailApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/interview/detail/${data.interviewId}`
  })
}

// 招聘端面试安排设置
export const setInterviewDetailApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: `/interview/setInterviewInfo/${data.interviewId}`,
    data
  })
}

// 开撩约面
export const applyInterviewApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: '/interview/applyInterview',
    data
  })
}

// 求职端确认面试安排
export const sureInterviewApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: `/interview/confirmArrangementInfo/${data.interviewId}`,
    data
  })
}

//求职者申请列表 (招聘端的邀请列表)
export const getApplyListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/interview/apply',
    data
  })
}

//收到邀请列表
export const getInviteListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/interview/invite',
    data
  })
}

//收到邀请列表
export const getScheduleListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/interview/schedule',
    data
  })
}


//获取底部面试状态
export const getInterviewStatusApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/interview/getInterviewStatus',
    data
  })
}

//确定约面
export const confirmInterviewApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: `/interview/confirm/${data.id}`
  })
}

//编辑不合适
export const refuseInterviewApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: `/interview/refuse/${data.id}`
  })
}

/* 招聘端 */
//收到意向列表
export const getIntentionListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/interview/intention`,
    data
  })
}

/* 面试全部红点 */
export const getRedDotListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/interview/getRedDotInfo`,
    data
  })
}

