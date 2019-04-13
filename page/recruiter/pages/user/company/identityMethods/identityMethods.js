let app = getApp()

import {RECRUITER} from '../../../../../../config.js'

Page({
  data: {
    cdnImagePath: app.globalData.cdnImagePath,
  	telePhone: app.globalData.telePhone,
    options: {}
  },
  onLoad(options) {
    this.setData({options})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-08
   * @detail   拨打电话
   * @return   {[type]}   [description]
   */
  callPhone() {
    wx.makePhoneCall({phoneNumber: app.globalData.telePhone})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-08
   * @detail   页面跳转
   * @return   {[type]}   [description]
   */
  routeJump(e) {
    let route = e.currentTarget.dataset.route
    let options = this.data.options
    switch(route) {
      case 'email':
        wx.navigateTo({url: `${RECRUITER}user/company/email/email?companyId=${options.companyId}`})
        break
      case 'license':
        wx.navigateTo({url: `${RECRUITER}user/company/upload/upload?companyId=${options.companyId}`})
        break
      case 'call':
        wx.makePhoneCall({phoneNumber: app.globalData.telePhone})
        break
      case 'contact':
        wx.makePhoneCall({phoneNumber: app.globalData.telePhone})
        break
      default:
        break
    }
  }
})