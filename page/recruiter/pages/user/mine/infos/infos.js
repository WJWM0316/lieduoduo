import { getRecruiterMyInfoApi } from '../../../../../../api/pages/recruiter.js'
import {RECRUITER, COMMON} from '../../../../../../config.js'
import {getUserRoleApi} from "../../../../../../api/pages/user.js"
import {shareRecruiter} from '../../../../../../utils/shareWord.js'
import {
  getCompanyIdentityInfosApi,
  getCompanyInfosApi,
  getRecruitersListApi
} from '../../../../../../api/pages/company.js'

let app = getApp()
let recruiterCard = ''
Page({
	data: {
    recruiterInfo: {},
    isRecruiter: app.globalData.isRecruiter,
    cdnPath: app.globalData.cdnImagePath,
    hasReFresh: false,
    identityInfos: {},
    infos: {}
  },
  onLoad() {
    recruiterCard = ''
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
  init() {
    let id = app.globalData.recruiterDetails.companyInfo.id
    let info = this.data.info
    getCompanyInfosApi({id}).then(res => {
      app.globalData.companyInfo = res.data
      getRecruitersListApi({id}).then(res0 => {
        app.globalData.companyInfo.recruiterList = res0.data
        this.setData({info: res.data})
      })
    })
  },
  onShow() {
    this.init()
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
      case 'team':
        wx.navigateTo({
          url: `${RECRUITER}company/recruiterList/recruiterList?companyId=${app.globalData.companyInfo.id}`
        })
      case 'interest':
        wx.navigateTo({url: `${RECRUITER}company/interest/interest` })
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
  getCreatedImg(e) {
    recruiterCard = e.detail
  },
  onShareAppMessage(options) {
    let that = this
　　return app.wxShare({
      options,
      title: shareRecruiter(),
      path: `${COMMON}recruiterDetail/recruiterDetail?uid=${this.data.recruiterInfo.uid}`,
      imageUrl: recruiterCard
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

    //未认证
    if(!identityInfos.identityAuth && (identityInfos.status !== 0 && identityInfos.status !== 1 && identityInfos.status !== 2)) {
      wx.navigateTo({url: `${RECRUITER}user/company/identity/identity`})
      return
    }

    // 已经填写身份证 但是管理员还没有处理或者身份证信息不符合规范
    if(identityInfos.status === 0 || identityInfos.status === 2) {
      wx.navigateTo({url: `${RECRUITER}user/company/status/status?from=identity`})
      return
    }
  }
})
