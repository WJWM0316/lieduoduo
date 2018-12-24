import { getCompanyInfosApi } from '../../../../../../api/pages/company.js'

Page({
  data: {
  	companyInfo: {}
  },
  onLoad(options) {
    getApp().globalData.identity = 'RECRUITER'
    getCompanyInfosApi({id: options.companyId})
    	.then(res => {
    		this.setData({companyInfo: res.data})
    		console.log(res.data)
    	})
  }
})