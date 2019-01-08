import {
  getCompanyIdentityInfosApi
} from '../../../../../../api/pages/company.js'

import {RECRUITER} from '../../../../../../config.js'

const app = getApp()

Page({
  data: {
  	// status状态： 0审核中（已提交），1审核通过，2审核未通过，3重新提交
    identityInfos: {},
    companyInfos: {}
  },
  onShow() {
    getCompanyIdentityInfosApi()
    	.then(res => {
    		this.setData({identityInfos: res.data, companyInfos: res.data.companyInfo})
    		console.log(res.data)
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