import {
  getRecruiterInterestApi
} from '../../../../../api/pages/recruiter.js'

let app = getApp()

Page({
  data: {
    cdnImagePath: app.globalData.cdnImagePath,
    infos: {},
    recruiterInfo: {}
  },
  onShow() {
    let recruiterInfo = app.globalData.recruiterDetails
    if (recruiterInfo.uid) {
      this.setData({recruiterInfo})
    } else {
      app.getAllInfo().then(res => {
        recruiterInfo = app.globalData.recruiterDetails
        this.setData({recruiterInfo}, () => console.log('b', recruiterInfo))
      })
    }
    getRecruiterInterestApi().then(res => {
      this.setData({infos: res.data})
    })
  },
  alert() {
    app.wxConfirm({
      title: '升级专业版',
      content: `了解更多猎多多招聘权益 欢迎联系我们~`,
      cancelText: '取消',
      confirmText: '联系客服',
      confirmBack: () => {
        wx.makePhoneCall({phoneNumber: '400-065-5788'})
      },
      cancelBack: () => {
        // wx.makePhoneCall({phoneNumber: '020-61279889'})
      }
    })
  }
})