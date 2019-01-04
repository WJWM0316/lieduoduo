import {
  getCompanyIdentityInfosApi
} from '../../../../../../api/pages/company.js'

const app = getApp()

Page({
  data: {
    
  },
  onShow() {
    getCompanyIdentityInfosApi({id: 2})
  }
})