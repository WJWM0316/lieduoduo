// 个人中心接口
import { request } from '../require'
// 个人中心首页接口
export const getMyInfoApi = () => {
  return request({
    method: 'get',
    url: '/jobhunter/myInfo'
  })
}
// 求职者个人基本信息
export const getBaseInfoApi = () => {
  return request({
    method: 'get',
    url: '/jobhunter/baseInfo'
  })
}
// 编辑求职者个人基本信息
export const editBaseInfoApi = (data) => {
  return request({
    method: 'post',
    url: '/jobhunter/baseInfo',
    data
  })
}
// 查询当前简历完善度
export const getResumeStepApi = (data) => {
  return request({
    method: 'get',
    url: '/jobhunter/resume/step',
    data
  })
}
// 完善简历第一步
export const postfirstStepApi = (data) => {
  return request({
    method: 'post',
    url: '/jobhunter/resume/firstStep',
    data
  })
}
// 完善简历第二步
export const postSecondStepApi = (data) => {
  return request({
    method: 'post',
    url: '/jobhunter/resume/secondStep',
    data
  })
}
// 完善简历第三步
export const postThirdStepApi = (data) => {
  return request({
    method: 'post',
    url: '/jobhunter/resume/thirdStep',
    data
  })
}

// 求职端个人简历接口
export const getPersonalResumeApi = (data) => {
  return request({
    method: 'get',
    url: '/jobhunter/resume',
    data,
    hasLoading: false
  })
}

// 个人简历意向修改
export const editExpectApi = (data) => {
  return request({
    method: 'post',
    url: `/jobhunter/expect/${data.id}`,
    data,
    hasLoading: false
  })
}

// 个人简历工作经验修改
export const editCareerApi = (data) => {
  return request({
    method: 'post',
    url: `/jobhunter/career/${data.id}`,
    data,
    hasLoading: false
  })
}

// 个人简历项目经验修改
export const editProjectApi = (data) => {
  return request({
    method: 'post',
    url: `/jobhunter/project/${data.id}`,
    data,
    hasLoading: false
  })
}

// 个人简历项目经验增加
export const addProjectApi = (data) => {
  return request({
    method: 'put',
    url: `/jobhunter/project`,
    data,
    hasLoading: false
  })
}