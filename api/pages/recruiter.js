import { request } from '../require.js'

// 获取招聘官所有招聘宣言
export const getRecruiterAllmanifestoApi = (data) => {
  return request({
    url: '/recruiter/allmanifesto',
    method: 'get',
    data,
    hasLoading: true
  })
}

// 招聘官-我的信息(“我的”页面)
export const getRecruiterMyInfoApi = (data) => {
  return request({
    url: '/recruiter/myInfo',
    method: 'get',
    data,
    hasLoading: true
  })
}

// 招聘官-我的信息(“我的”页面)
export const saveRecruiterInfoApi = (data) => {
  return request({
    url: '/recruiter/baseInfo',
    method: 'post',
    data,
    hasLoading: true
  })
}

// 招聘官-详情
export const getRecruiterDetailApi = (data) => {
  return request({
    url: `/recruiter/detail`,
    method: 'get',
    data,
    hasLoading: false
  })
}
export const getOthersRecruiterDetailApi = (data) => {
  return request({
    url: `/recruiter/detail/uid/${data.uid}`,
    method: 'get',
    hasLoading: true
  })
}

// 招聘官打call
export const giveMecallApi = (data) => {
  return request({
    url: `/recruiter/callRecruiter/${data.vkey}`,
    method: 'put',
    data,
    hasLoading: true
  })
}

// 浏览过我的招聘官
export const getBrowseMySelfListsApi = (data) => {
  return request({
    url: `/browse/browseMySelf`,
    method: 'get',
    data,
    hasLoading: true
  })
}

// 设置招聘官个人简介
export const setBriefApi = (data) => {
  return request({
    url: `/recruiter/brief`,
    method: 'post',
    data,
    hasLoading: true
  })
}
// 设置招聘官宣言
export const setManifestoApi = (data) => {
  return request({
    url: `/recruiter/manifesto`,
    method: 'post',
    data,
    hasLoading: true
  })
}
// 获取话题
export const getTopicListApi = (data, hasLoading) => {
  return request({
    url: `/manifesto/topicList`,
    method: 'get',
    data,
    hasLoading: hasLoading
  })
}
// 删除宣言
export const removeTopicApi = (data) => {
  return request({
    url: `/recruiter/manifesto/${data.id}`,
    method: 'delete',
    data,
    hasLoading: true
  })
}
// 给招聘官的个人标签点赞
export const putLabelFavorApi = (data) => {
  return request({
    url: `/recruiter/labelFavor/${data.recruiterLabelId}`,
    method: 'put',
    data,
    hasLoading: true
  })
}
