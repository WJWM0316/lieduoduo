import { request } from '../require.js'

// 获取招聘官所有招聘宣言
export const getRecruiterAllmanifestoApi = (data) => {
  return request({
    url: '/recruiter/allmanifesto',
    method: 'get',
    data
  })
}

// 招聘官-我的信息(“我的”页面)
export const getRecruiterMyInfoApi = (data) => {
  return request({
    url: '/recruiter/myInfo',
    method: 'get',
    data
  })
}

// 招聘官-我的信息(“我的”页面)
export const saveRecruiterInfoApi = (data) => {
  return request({
    url: '/recruiter/baseInfo',
    method: 'post',
    data
  })
}

// 招聘官-详情
export const getRecruiterDetailApi = (data) => {
  return request({
    url: `/recruiter/detail`,
    method: 'get',
    data
  })
}
export const getOthersRecruiterDetailApi = (data) => {
  return request({
    url: `/recruiter/detail/uid/${data.uid}`,
    method: 'get',
    data
  })
}

// 招聘官打call
export const giveMecallApi = (data) => {
  return request({
    url: `/recruiter/callRecruiter/${data.vkey}`,
    method: 'put',
    data
  })
}

// 浏览过我的招聘官
export const getBrowseMySelfListsApi = (data) => {
  return request({
    url: `/browse/browseMySelf`,
    method: 'get',
    data
  })
}

// 设置招聘官个人简介
export const setBriefApi = (data) => {
  return request({
    url: `/recruiter/brief`,
    method: 'post',
    data
  })
}
// 设置招聘官宣言
export const setManifestoApi = (data) => {
  return request({
    url: `/recruiter/manifesto`,
    method: 'post',
    data
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
    data
  })
}
// 给招聘官的个人标签点赞
export const putLabelFavorApi = (data) => {
  return request({
    url: `/recruiter/labelFavor/${data.recruiterLabelId}`,
    method: 'put',
    data
  })
}

// 给招聘官的个人标签取消点赞
export const removeLabelFavorApi = (data) => {
  return request({
    url: `/recruiter/labelFavor/${data.recruiterLabelId}`,
    method: 'delete',
    data
  })
}

// 获取招聘官审核列表
export const getApplyjoinListApi = (data) => {
  return request({
    url: `/applyjoin/list`,
    method: 'get',
    data,
    hasLoading: data.hasLoading
  })
}

// 获取招聘官审核信息
export const getApplyjoinInfosApi = (data) => {
  return request({
    url: `/applyjoin/${data.id}`,
    method: 'get',
    data,
    hasLoading: data.hasLoading
  })
}

// 加入公司申请审核不通过
export const failApplyjoinApi = (data, hasLoading) => {
  return request({
    url: `/applyjoin/fail/${data.id}`,
    method: 'put',
    data,
    hasLoading: hasLoading
  })
}

// 加入公司申请审核通过
export const passApplyjoinApi = (data, hasLoading) => {
  return request({
    url: `/applyjoin/pass/${data.id}`,
    method: 'put',
    data,
    hasLoading: hasLoading
  })
}

// 获取当前招聘官的权益
export const getRecruiterInterestApi = (data, hasLoading) => {
  return request({
    url: `/right/cur/recruiter`,
    method: 'get',
    data,
    hasLoading: false
  })
}

// 获取招聘官我的页面信息
export const getRecruiterOtherInfosApi = (data) => {
  return request({
    url: `/recruiter/mine/extra`,
    method: 'get',
    data,
    hasLoading: false
  })
}

// 获取首页我感兴趣的，最近面试，在招职位
export const getIndexShowCountApi = (data) => {
  return request({
    url: `/indexShowCount`,
    method: 'get',
    hasLoading: false
  })
}

// 获取精选顾问列表
export const getAdvisorListApi = (data, hasLoading) => {
  return request({
    url: `/advisor/recommend/list`,
    method: 'get',
    data,
    hasLoading: hasLoading
  })
}

// 获取扣点信息
export const getRecommendChargeApi = (data, hasLoading) => {
  return request({
    url: `/advisor/recommend/charge/${data.positionId}`,
    method: 'get',
    data,
    hasLoading: hasLoading
  })
}

// 获取我的账户信息
export const getMyAccoutApi = (data, hasLoading) => {
  return request({
    url: `/user/account`,
    method: 'get',
    data,
    hasLoading: hasLoading
  })
}

// 获取我的账户明细
export const getOrdersListApi = (data, hasLoading) => {
  return request({
    url: `/user/account/orders`,
    method: 'get',
    data,
    hasLoading: hasLoading
  })
}


// 获取精选顾问tab红点
export const getRecommendReddotApi = (data, hasLoading) => {
  return request({
    url: `/advisor/recommend/red_dot`,
    method: 'get',
    data,
    hasLoading: hasLoading
  })
}

// 获取城市、薪资范围等搜索条件
export const getRecommendRangeAllApi = (data, hasLoading) => {
  return request({
    url: `/recommend/ranges/all`,
    method: 'get',
    data,
    hasLoading: hasLoading
  })
}

// 当推荐任务还没跑完时调用该方法获取简历
export const getRecommendResumePageListsApi = (data, hasLoading) => {
  return request({
    url: `/recommend/resume/page`,
    method: 'get',
    data,
    hasLoading: hasLoading
  })
}

// 获取下一批平台推荐简历
export const getRecommendResumeListsApi = (data, hasLoading) => {
  return request({
    url: `/recommend/resumes`,
    method: 'get',
    data,
    hasLoading: hasLoading
  })
}

// 分页获取搜索范围 - 职位
export const getRecommendPositionRangeListsApi = (data, hasLoading) => {
  return request({
    url: `/recommend/position/ranges`,
    method: 'get',
    data,
    hasLoading: hasLoading
  })
}

// “为你推荐”列表, 列表数据过少时显示
export const getRecommendResumeMoreListsApi = (data, hasLoading) => {
  return request({
    url: `/recommend/resume/more`,
    method: 'get',
    data,
    hasLoading: hasLoading
  })
}

// 简历储备
export const getReserveResumeSearchListsApi = (data, hasLoading) => {
  return request({
    url: `/reserve/resume/search`,
    method: 'get',
    data,
    hasLoading: hasLoading
  })
}

// 获取简历储备搜索范围
export const getReserveResumeSearchRangeListsApi = (data, hasLoading) => {
  return request({
    url: `/reserve/resume/search_range`,
    method: 'get',
    data,
    hasLoading: hasLoading
  })
}

// 获取职位搜索范围
export const getReserveResumeSearchPositionRangeListsApi = (data, hasLoading) => {
  return request({
    url: `/reserve/resume/position_range`,
    method: 'get',
    data,
    hasLoading: hasLoading
  })
}
