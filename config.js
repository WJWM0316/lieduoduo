/**
 * 小程序配置的文件
 */

// 环境切换
let environment = 0
export let APPLICANTHOST = ''
export let RECRUITERHOST = ''
export let PUBAPIHOST = ''
if (environment === 1) {
	// 测试服接口
	APPLICANTHOST = 'https://qiuzhi-api.lieduoduo.ziwork.com'
	RECRUITERHOST = 'https://zhaopin-api.lieduoduo.ziwork.com'
	PUBAPIHOST = 'https://pub-api.lieduoduo.ziwork.com'
} else {
	// 正式服环境
	APPLICANTHOST = 'https://qiuzhi-api.lieduoduo.com'
	RECRUITERHOST = 'https://zhaopin-api.lieduoduo.com'
	PUBAPIHOST = 'https://pub-api.lieduoduo.com'
}




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