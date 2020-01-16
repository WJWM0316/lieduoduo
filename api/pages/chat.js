import { request } from '../require.js'

// 获取约聊详情
export const getChatDetailsApi = (data, hasLoading) => {
  return request({
    url: '/chat',
    method: 'get',
    data,
    hasLoading
  })
}

// 设置约聊“已查看”
export const setChatViewedApi = (data, hasLoading) => {
  return request({
    url: '/chat/viewed',
    method: 'put',
    data,
    hasLoading
  })
}

// 分页获取约聊列表（返回值不含total）
export const getChatSimplepageListApi = (data, hasLoading) => {
  return request({
    url: '/chat/simplepage',
    method: 'get',
    data,
    hasLoading
  })
}

// 求职者发起约聊
export const applyChatApi = (data, hasLoading) => {
  return request({
    url: '/chat/apply',
    method: 'post',
    data,
    hasLoading
  })
}

// 接受约聊
export const acceptChatApi = (data, hasLoading) => {
  return request({
    url: '/chat/accept',
    method: 'put',
    data,
    hasLoading
  })
}

// 获取所有不感兴趣原因
export const getNotInterestAllReasonListApi = (data, hasLoading) => {
  return request({
    url: '/chat/not_interest/all_reason',
    method: 'get',
    data,
    hasLoading
  })
}

// 设置约聊不感兴趣
export const setNotInterestApi = (data, hasLoading) => {
  return request({
    url: '/chat/not_interest',
    method: 'post',
    data,
    hasLoading
  })
}

// 取消设置约聊不感兴趣
export const deleteNotInterestApi = (data, hasLoading) => {
  return request({
    url: '/chat/not_interest',
    method: 'delete',
    data,
    hasLoading
  })
}

// 获取多个约聊（ids、recruiters、jpushIds优先级一次降低，同时使用多个参数仅优先级高一个生效）
export const getAllChatListApi = (data, hasLoading) => {
  return request({
    url: '/chats',
    method: 'get',
    data,
    hasLoading
  })
}