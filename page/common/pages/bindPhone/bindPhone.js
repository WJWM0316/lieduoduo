import {COMMON,RECRUITER} from '../../../../config.js'
import {sendCodeApi, checkSessionKeyApi} from "../../../../api/pages/auth.js"
import {quickLoginApi} from '../../../../api/pages/auth.js'

let mobileNumber = 0
let second = 60
let app = getApp()
let timer = null
let timerInt = null
let backType = 'backPrev'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    code: '',
    cdnImagePath: app.globalData.cdnImagePath,
    second: 60,
    canClick: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    backType = 'backPrev'
    if (options.backType) backType = options.backType
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          checkSessionKeyApi({session_token: wx.getStorageSync('sessionToken')}).catch(e => {
            wx.navigateTo({
              url: `${COMMON}auth/auth`
            })
          })
        }
      },
      fail: e => {
        wx.navigateTo({
          url: `${COMMON}auth/auth`
        })
      }
    })
  },
  toJump () {
    wx.navigateTo({
      url: `${COMMON}webView/webView?type=userAgreement`
    })
  },
  getPhone(e) {
    mobileNumber = e.detail.value
    clearTimeout(timer)
    timer = setTimeout(() => {
      this.setData({
        phone: e.detail.value
      })
      this.setData({canClick: this.data.code && this.data.phone ? true : false})
    }, 100)
  },
  getCode(e) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      this.setData({
        code: e.detail.value
      })
      this.setData({canClick: this.data.code && this.data.phone ? true : false})
      clearTimeout(timer)
    }, 100)
  },
  setTime (second) {
    timerInt = setInterval(() => {
      second--
      if (second === 0) {
        second = 60
        clearInterval(timerInt)
      }
      this.setData({second})
    }, 1000)
  },
  sendCode() {
    if (!this.data.phone) {
      app.wxToast({
        title: '请填写手机号'
      })
      return
    }
    let data = {
      mobile: this.data.phone
    }
    sendCodeApi(data).then(res => {
      this.isBlured = false
      this.callback = null
      second = 60
      app.wxToast({
        title: '验证码发送成功',
        icon: 'success'
      })
      this.setTime(second)
    })
  },
  bindPhone() {
    if (!this.data.canClick) return
    let data = {
      mobile: this.data.phone,
      code: this.data.code
    }
    app.phoneLogin(data, backType)
  },
  getPhoneNumber(e) {
    app.quickLogin(e, backType)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})