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
    pageTitle: ''
  },
  onLoad(options) {
    switch(options.page) {
      case 'identity':
        this.setData({pageTitle: '身份认证', page: 'identity'})
        break
      case 'company':
        this.setData({pageTitle: '申请加入公司', page: 'company'})
        break
      default:
        break
    }
    getCompanyIdentityInfosApi()
    	.then(res => {
    		this.setData({identityInfos: res.data, companyInfos: res.data.companyInfo})
    	})
  },
  todoAction(e) {
  	const params = e.currentTarget.dataset
  	switch(params.action) {
  		case 'modifyIdentity':
  			wx.redirectTo({url: `${RECRUITER}user/company/identity/identity`})
  			break
  		case 'modifyCompany':
  			wx.redirectTo({url: `${RECRUITER}user/company/apply/apply`})
  			break
  		default:
  			break
  	}
  }
})