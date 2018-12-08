import {request} from '../require.js'



// 登录
export const loginApi = (data) => {
  return request({
    url: '/auto/login',
    data
  })
}

// 创建第一步
export const firstSignApi = (data) => {
  return request({
    method: 'put',
    url: '/cur/first',
    data
  })
}
// 创建第二步
export const secondSignApi = (data) => {
  return request({
    method: 'put',
    url: '/cur/second',
    data
  })
}
// 创建第三步
export const thirdSignApi = (data) => {
  return request({
    method: 'put',
    url: '/cur/third',
    data
  })
}

// 获取标签接口
export const postGetLabelByIds = (data) => {
  return request({
    method: 'post',
    url: '/label/getLabelByIds',
    data
  })
}

// 获取标签配置接口
export const getLabelConfig = () => {
  return request({
    method: 'post',
    url: '/label/getLabelConfig',
  })
}

// 获取用户已筛选标签
export const getChoiceLabel = (data) => {
  return request({
    method: 'post',
    url: '/label/showUserChoiceLabel',
    data,
  })
}


// 获取用户标签接口
export const postUserLabel = (data) => {
  return request({
    method: 'post',
    url: '/label/showSimpleLabel',
    data
  })
}

// 检查自定义标签接口
export const checkLable = (data) => {
  return request({
    method: 'post',
    url: '/label/checkCustomizeLabel',
    data,
    isLoading: false
  })
}

// 保存标签接口
export const saveLable = (data) => {
  return request({
    method: 'post',
    url: '/label/saveEditLabel',
    data,
    isLoading: false
  })
}

// 获取创建第三步人设标签与生活标签
export const postGetCreatedThreeLable = (data) => {
  return request({
    method: 'post',
    url: '/label/getCreatedThreeLabel',
    data,
    isLoading: false
  })
}

// 保存筛选结果接口
export const saveUserIdByLabelSelect = (data) => {
  return request({
    method: 'post',
    url: '/label/saveUserIdByLabelSelect',
    data,
    isLoading: false
  })
}

// 用户允许授权后需返回数据给该接口
export const grantInformationApi = (data) => {
  return request({
    url: '/auth/grantInformation',
    data,
    isLoading: false
  })
}
// 不需要用户允许授权后需返回数据给该接口
export const saveBaseUserInfo = (data) => {
  console.log(data)
  return request({
    url: '/auth/saveBaseUserInfo',
    data,
    isLoading: false
  })
}
// code 给后端去换session_key
export const getSessionKeyApi = (data) => {
  return request({
    url: '/auth/getSessionKey',
    data,
  })
}

// 是否绑定手机
export const isBindPhoneApi = (data) => {
  return request({
    url: '/wx/my/isBindPhone',
    data
  })
}

// 获取短信验
export const smsApi = (data) => {
  return request({
    url: '/auth/getSmsCode',
    data
  })
}

// 获取验证码图片
export const getCodeImg = (data) => {
  return request({
    url: '/wx/captchas',
    data
  })
}


// 获取分享信息
export const getShareConfig = (data) => {
  return request({
    url: '/share/getShareConfig',
    data
  })
}

// 获取分享信息
export const getShareImg = (data) => {
  return request({
    url: '/share/getShareImages',
    data,
    isLoading: false
  })
}

// 获取炫耀信息接口
export const getSharePickApi = (data) => {
  return request({
    url: '/share/getShareInfo',
    data
  })
}

