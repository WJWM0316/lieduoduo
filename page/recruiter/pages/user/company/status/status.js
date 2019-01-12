import {
  getCompanyIdentityInfosApi
} from '../../../../../../api/pages/company.js'

import {RECRUITER} from '../../../../../../config.js'

const app = getApp()

Page({
  data: {
  	// status状态： 0审核中（已提交），1审核通过，2审核未通过，3重新提交
    identityInfos: {},
    companyInfos: {},
    page: '',
    pageTitle: '公司认证',
    options: {}
  },
  onLoad(options) {
    switch(options.from) {
      case 'identity':
        this.setData({pageTitle: '身份认证'})
        break
      case 'company':
        this.setData({pageTitle: '公司认证'})
        break
      case 'apply':
        this.setData({pageTitle: '申请加入公司'})
        break
      default:
        break
    }
    getCompanyIdentityInfosApi()
    	.then(res => {
        const infos = res.data
        const companyInfos = infos.companyInfo
    		this.setData({identityInfos: infos, companyInfos, options})
    	})
  },
  todoAction(e) {
  	const params = e.currentTarget.dataset
  	switch(params.action) {
  		case 'modifyIdentity':
  			wx.reLaunch({url: `${RECRUITER}user/company/identity/identity?type=edit`})
  			break
  		case 'modifyCompany':
  			wx.redirectTo({url: `${RECRUITER}user/company/apply/apply?type=edit`})
  			break
      case 'email':
        wx.redirectTo({url: `${RECRUITER}user/company/email/email`})
        break
      case 'position':
        wx.redirectTo({url: `${RECRUITER}position/post/post`})
        break
  		default:
  			break
  	}
  }
})