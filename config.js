/**
 * 小程序配置的文件
 */

// 测试服接口
let host = ''
let choseType = wx.getStorageSync('choseType') || null
if (choseType === 'APPLICANT') {
  host = 'https://qiuzhi-api.lieduoduo.ziwork.com'
} else {
  host = 'https://zhaopin-api.lieduoduo.ziwork.com'
}

export const BASEHOST = host

// 内嵌h5基本路径测试服
export const STATICHOST = 'https://stg.ziwork.com'

// 内嵌h5基本路径生产服
// var staticHost = 'https://light.house.zike.com'

// cdn资源路径
export const CDNPATH = ''

// 招聘端page
export const RECRUITER = '/page/recruiter/pages/'

// 应聘端page
export const APPLICANT = '/page/applicant/pages/'

// 公共包page
export const COMMON = '/page/common/pages/'

// components
export const COMPONENTS = '/components/'

// api
export const API = '/api/'