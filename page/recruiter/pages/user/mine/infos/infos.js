import { getRecruiterMyInfoApi } from '../../../../../../api/pages/recruiter.js'
import {RECRUITER, COMMON} from '../../../../../../config.js'
import {getUserRoleApi} from "../../../../../../api/pages/user.js"
import {shareRecruiter} from '../../../../../../utils/shareWord.js'
import {
  getCompanyIdentityInfosApi
} from '../../../../../../api/pages/company.js'

const app = getApp()

Page({
	data: {
    recruiterInfo: {},
    isRecruiter: app.globalData.isRecruiter,
    cdnPath: app.globalData.cdnImagePath,
    hasReFresh: false,
    identityInfos: {}
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
  onShow() {
    this.getCompanyIdentityInfos()
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
        this.viewIdentity()
        break
      case 'settings':
        wx.navigateTo({url: `${COMMON}settings/settings`})
        break
      case 'poster':
        wx.navigateTo({url: `${COMMON}poster/recruiter/recruiter`})
        break
      default:
        break
    }
  },
  formSubmit(e) {
    app.postFormId(e)
  },
  preview(e) {
    wx.previewImage({
      current: this.data.recruiterInfo.avatar.url,
      urls: [this.data.recruiterInfo.avatar.url],
      complete() {
      }
    })
  },
  callPhone() {
    wx.makePhoneCall({
      phoneNumber: '020-61279889' // 仅为示例，并非真实的电话号码
    })
  },
  onPullDownRefresh(hasLoading = true) {
    this.setData({hasReFresh: true})
    app.getAllInfo().then(res => {
      this.setData({recruiterInfo: res, hasReFresh: false}, () => wx.stopPullDownRefresh())
      this.getCompanyIdentityInfos()
    })
  },
  onShareAppMessage(options) {
    let that = this
　　return app.wxShare({
      options,
      title: shareRecruiter,
      path: `${COMMON}recruiterDetail/recruiterDetail?uid=${this.data.recruiterInfo.uid}`,
      imageUrl: app.globalData.recruiterCard
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-29
   * @detail   获取个人身份信息
   * @return   {[type]}   [description]
   */
  getCompanyIdentityInfos() {
    getCompanyIdentityInfosApi().then(res => {
      this.setData({identityInfos: res.data})
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-02-20
   * @detail   查看认证状态
   * @return   {[type]}   [description]
   */
  viewIdentity() {
    
    const identityInfos = this.data.identityInfos

    //还没有填写身份信息
    if(!identityInfos.identityNum) {
      const realName = identityInfos.companyInfo.realName ? identityInfos.companyInfo.realName : ''
      wx.navigateTo({url: `${RECRUITER}user/company/identity/identity?type=identity&realName=${realName}`})
      return;
    }

    // 已经填写身份证 但是管理员还没有处理或者身份证信息不符合规范
    if(identityInfos.status === 0 || identityInfos.status === 2) {
      wx.navigateTo({url: `${RECRUITER}user/company/status/status?from=identity`})
      return;
    }
  }
})
