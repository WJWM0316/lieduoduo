import { getRecruiterMyInfoApi } from '../../../../../../api/pages/recruiter.js'
import {RECRUITER, COMMON} from '../../../../../../config.js'
import {getUserRoleApi} from "../../../../../../api/pages/user.js"

const app = getApp()

Page({
	data: {
    recruiterInfo: {},
    isRecruiter: app.globalData.isRecruiter,
    cdnPath: app.globalData.cdnImagePath
  },
  onLoad() {
    let recruiterInfo = app.globalData.recruiterDetails
    if (recruiterInfo.uid) {
      this.setData({recruiterInfo})
    } else {
      app.getAllInfo().then(res => {
        recruiterInfo = app.globalData.recruiterDetails
        this.setData({recruiterInfo})
      })
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-19
   * @detail   前往更新用户资料
   * @return   {[type]}   [description]
   */
  jumpUpdateInfos() {
    wx.navigateTo({
      url: `${COMMON}recruiterDetail/recruiterDetail?uid=${this.data.recruiterInfo.uid}`
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-24
   * @detail   跳出当前页面
   * @return   {[type]}     [description]
   */
  routeJump(e) {
    const route = e.currentTarget.dataset.route
    switch(route) {
      case 'company':
        wx.navigateTo({url: `${RECRUITER}company/indexEdit/indexEdit`})
        break
      case 'base':
        wx.navigateTo({url: `${RECRUITER}user/mine/base/base`})
        break
      case 'identity':
        wx.navigateTo({url: `${RECRUITER}user/company/status/status?from=identity`})
        break
      case 'settings':
        wx.navigateTo({url: `${COMMON}settings/settings`})
        break
      default:
        break
    }
  },
  preview(e) {
    wx.previewImage({
      current: this.data.recruiterInfo.avatar.middleUrl,
      urls: [this.data.recruiterInfo.avatar.middleUrl],
      complete() {
        console.log(111111111)
      }
    })
  }
})
