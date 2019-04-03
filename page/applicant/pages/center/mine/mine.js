import {COMMON,APPLICANT,RECRUITER} from '../../../../../config.js'
import { getPersonalResumeApi } from '../../../../../api/pages/center.js'
import {shareResume} from '../../../../../utils/shareWord.js'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myInfo: {},
    hasLogin: false,
    hideBind: true,
    hasReFresh: false,
    cdnImagePath: app.globalData.cdnImagePath,
    resumeAttach: {},
    navH: app.globalData.navHeight,
    isJobhunter: 0,
    telePhone: app.globalData.telePhone
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    let hasLogin = false
    let myInfo = {}
    let isJobhunter = 0
    if (app.pageInit) {
      hasLogin = app.globalData.hasLogin
      myInfo = app.globalData.resumeInfo
      isJobhunter = app.globalData.isJobhunter
      this.setData({myInfo, isJobhunter, hasLogin, resumeAttach: myInfo.resumeAttach || {}})
    }
    app.pageInit = () => {
      hasLogin = app.globalData.hasLogin
      myInfo = app.globalData.resumeInfo
      isJobhunter = app.globalData.isJobhunter
      this.setData({myInfo, hasLogin, isJobhunter})
    }
  },
  call() {
    wx.makePhoneCall({
      phoneNumber: app.globalData.telePhone
    })
  },
  formSubmit(e) {
    app.postFormId(e.detail.formId)
  },
  online() {
    app.wxConfirm({
      title: '联系客服',
      content: '欢迎添加猎多多了解更多内容 有疑问请添加客服微信：zike107',
      confirmText: '复制',
      confirmBack() {
        wx.setClipboardData({
          data: 'zike107',
          success(res) {
            wx.getClipboardData({
              success(res) {
                app.wxToast({
                  title: '复制成功',
                  icon: 'success'
                })
              }
            })
          }
        })
      }
    })
  },
  onHide() {
    this.setData({hideBind: true})
  },
  login() {
    this.setData({hideBind: false})
  },
  jump(e) {
    switch(e.currentTarget.dataset.type) {
      case "settings":
        wx.navigateTo({
          url: `${COMMON}settings/settings`
        })
        break
      case "poster":
        wx.navigateTo({
          url: `${COMMON}poster/resume/resume`
        })
        break
      case "scanCode":
        if(this.data.isJobhunter) {
          wx.navigateTo({url: `${APPLICANT}center/attachment/attachment` })
        }
        break
      default:
        break
    }
  },
  /* 去完善简历 */
  completeResume () {
    wx.navigateTo({
      url: `${APPLICANT}center/createUser/createUser`
    })
  },
  /* 编辑简历 */
  toEdit () {
    wx.navigateTo({
      url: `${COMMON}resumeDetail/resumeDetail?uid=${this.data.myInfo.uid}`,
    })
  },
  onPullDownRefresh(hasLoading = true) {
    this.setData({hasReFresh: true})
    getPersonalResumeApi({...app.getSource()}).then(res => {
      app.globalData.resumeInfo = res.data
      this.setData({hasReFresh: false, myInfo: res.data})
      wx.stopPullDownRefresh()
    }).catch(e => {
      this.setData({hasReFresh: false})
      wx.stopPullDownRefresh()
    })
  },
  onShareAppMessage(options) {
    let that = this
　　return app.wxShare({
      options,
      btnTitle: shareResume(),
      btnPath: `${COMMON}resumeDetail/resumeDetail?uid=${this.data.myInfo.uid}`,
      btnImageUrl: `${that.data.cdnImagePath}shareC.png`
    })
  },
  toggleIdentity() {
    app.wxConfirm({
      title: '身份切换',
      content: `是否切换为面试官身份`,
      confirmBack() {
        app.toggleIdentity()
      }
    })
  }
})