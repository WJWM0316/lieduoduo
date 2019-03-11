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
    this.getPageInfos()
  },
  getPageInfos() {
    return new Promise((resolve, reject) => {
      let recruiterInfo = app.globalData.recruiterDetails
      if (recruiterInfo.uid) {
        this.setData({recruiterInfo})
        this.getRecruiterInterest().then(() => resolve())
      } else {
        app.getAllInfo().then(res => {
          recruiterInfo = app.globalData.recruiterDetails
          this.setData({recruiterInfo})
          this.getRecruiterInterest().then(() => resolve())
        })
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-03-11
   * @detail   获取权益信息
   * @return   {[type]}   [description]
   */
  getRecruiterInterest() {
    return new Promise((resolve, reject) => {
      getRecruiterInterestApi().then(res => this.setData({infos: res.data}, () => resolve(res)))
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
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   下拉重新获取数据
   * @return   {[type]}              [description]
   */
  onPullDownRefresh() {
    this.setData({hasReFresh: true})
    this.getPageInfos(false).then(res => {
      console.log(res)
      this.setData({hasReFresh: false}, () => wx.stopPullDownRefresh())
    }).catch(e => {
      wx.stopPullDownRefresh()
    })
  }
})