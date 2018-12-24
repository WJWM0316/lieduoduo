import { getCompanyInfosApi } from '../../../../../../api/pages/company.js'

Page({
	data: {},
  onLoad(options) {
  	console.log(options)
    getApp().globalData.identity = 'RECRUITER'
    getCompanyInfosApi({id: options.companyId})
  }
})