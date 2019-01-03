import {
  postFormIdApi
} from '../../../../api/pages/user.js'

Page({
  onLoad() {
    getApp().globalData.identity = 'RECRUITER'
  },
  submit(e) {
    postFormIdApi({form_id: e.detail.formId, 'Authorization-Wechat': wx.getStorageSync('sessionToken')})
  }
})