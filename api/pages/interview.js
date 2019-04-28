import { request } from '../require.js'

// 招聘官撩约接口
export const inviteInterviewApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: '/interview/inviteInterview',
    data,
    hasLoading
  })
}

// 求职端面试详情
export const interviewDetailApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/interview/detail/${data.interviewId}`,
    data,
    hasLoading
  })
}

// 招聘端面试安排设置
export const setInterviewDetailApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: `/interview/setInterviewInfo/${data.interviewId}`,
    data,
    hasLoading
  })
}

// 开撩约面
export const applyInterviewApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: '/interview/applyInterview',
    data,
    hasLoading
  })
}

// 求职端确认面试安排
export const sureInterviewApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: `/interview/confirmArrangementInfo/${data.interviewId}`,
    data,
    hasLoading
  })
}

//求职者申请列表 (招聘端的邀请列表)
export const getApplyListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/interview/apply',
    data,
    hasLoading
  })
}

//收到邀请列表
export const getInviteListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/interview/invite',
    data,
    hasLoading
  })
}

//面试列表
export const getScheduleListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/interview/schedule',
    data,
    hasLoading
  })
}

//面试列表日期数量
export const getScheduleNumberApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/interview/scheduleNumber',
    data,
    hasLoading
  })
}


//获取底部面试状态
export const getInterviewStatusApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/interview/getInterviewStatus',
    data,
    hasLoading: false
  })
}

//确定约面
export const confirmInterviewApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: `/interview/confirm/${data.id}`,
    data,
    hasLoading
  })
}

//编辑不合适
export const refuseInterviewApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: `/interview/refuse/${data.id}`,
    hasLoading
  })
}

/* 招聘端 */
//收到意向列表
export const getIntentionListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/interview/intention`,
    data,
    hasLoading
  })
}

/* 面试全部红点 */
export const getRedDotListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/interview/getRedDotInfo`,
    data,
    hasLoading
  })
}

// 面试安排不合适
export const notonsiderInterviewApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: `/interview/notonsider/${data.id}`,
    hasLoading
  })
}

// 全部面试
export const getInterviewHistoryApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/interview/history`,
    data,
    hasLoading
  })
}

// 获取日历面试数量（新）
export const getNewScheduleNumberApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/interview/newScheduleNumber`,
    data,
    hasLoading
  })
}

// 面试历史（新）
export const getNewHistoryApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/interview/newHistory`,
    data,
    hasLoading
  })
}


// 获取当前招聘官职位类型列表
export const getPositionTypeListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/position/typelist`,
    data,
    hasLoading: false
  })
}
