import {
  getCompanyIdentityInfosApi
} from '../../../../../../api/pages/company.js'

const app = getApp()

Page({
  data: {
    
  },
  onShow() {
    getApp().globalData.identity = 'RECRUITER'
    getCompanyIdentityInfosApi({id: 2})
  }
})