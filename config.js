/**
 * 小程序配置的文件
 */

// 环境切换
// 0 是测试环境  1 是正式环境
let environment = 0
export let 	VERSION = 108,
						APPLICANTHOST = '',
						RECRUITERHOST = '',
						PUBAPIHOST = '',
						NODEHOST = '',
						WEBVIEW = '',
						CDNPATH = ''
if (environment === 0) {
	// 测试服口
	APPLICANTHOST = 'https://qiuzhi-api.lieduoduo.ziwork.com'
	RECRUITERHOST = 'https://zhaopin-api.lieduoduo.ziwork.com'
	PUBAPIHOST = 'https://pub-api.lieduoduo.ziwork.com'
	NODEHOST = 'https://node.lieduoduo.ziwork.com/frontEnd'
	WEBVIEW = `https://h5.lieduoduo.ziwork.com/`
	CDNPATH = 'https://attach.lieduoduo.ziwork.com/front-assets/images/'
} else {
	// 正式服环境
	APPLICANTHOST = 'https://qiuzhi-api.lieduoduo.com'
	RECRUITERHOST = 'https://zhaopin-api.lieduoduo.com'
	PUBAPIHOST = 'https://pub-api.lieduoduo.com'
	NODEHOST =  'https://node.lieduoduo.com/frontEnd'
	WEBVIEW = `https://h5.lieduoduo.com/`
	CDNPATH = 'https://attach.lieduoduo.com/front-assets/images/'
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