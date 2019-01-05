import { getRecruiterMyInfoApi } from '../../../../../../api/pages/recruiter.js'
import {RECRUITER} from '../../../../../../config.js'

const app = getApp()

Page({
	data: {
    recruiterInfo: {}
  },
  onLoad() {
    getApp().globalData.identity = 'RECRUITER'
    getRecruiterMyInfoApi()
      .then(res => {
        this.setData({recruiterInfo: res.data})
        console.log(res.data)
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-19
   * @detail   前往更新用户资料
   * @return   {[type]}   [description]
   */
  jumpUpdateInfos() {
    wx.navigateTo({
      url: `${RECRUITER}user/userInfoEdit/userInfoEdit`
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
        wx.navigateTo({url: `${RECRUITER}user/company/infos/infos?companyId=${this.data.recruiterInfo.companyId}`})
        break
      case 'base':
        wx.navigateTo({url: `${RECRUITER}user/mine/base/base`})
        break
      default:
        break
    }
  },
  share() {
    wx.showShareMenu({
      withShareTicket: true,
      success(e) {
        console.log(e, 1)
      },
      fail(e) {
        console.log(e, 2)
      }
    })
  }
})
