import {COMMON,RECRUITER} from '../../../../config.js'
import {sendCodeApi, bindPhoneApi, checkSessionKeyApi} from "../../../../api/pages/auth.js"
import {quickLoginApi} from '../../../../api/pages/auth.js'

let mobileNumber = 0
let app = getApp()
let timer = null
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
    wx.removeStorageSync('toBindPhone')
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          checkSessionKeyApi().catch(e => {
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
  getPhone(e) {
    mobileNumber = e.detail.value
    clearTimeout(timer)
    timer = setTimeout(() => {
      this.setData({
        phone: e.detail.value
      })
      this.setData({canClick: this.data.code && this.data.phone ? true : false})
    }, 300)
  },
  getCode(e) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      this.setData({
        code: e.detail.value
      })
      this.setData({canClick: this.data.code && this.data.phone ? true : false})
    }, 300)
  },
  sendCode() {
    if (!mobileNumber) {
      app.wxToast({
        title: '请填写手机号'
      })
      return
    }
    let data = {
      mobile: mobileNumber
    }
    sendCodeApi(data).then(res => {
      this.isBlured = false
      this.callback = null
      let second = 60
      let timer = null
      app.wxToast({
        title: '验证码发送成功',
        icon: 'success'
      })
      timer = setInterval(() => {
        second--
        if (second === 0) {
          second = 60
          clearInterval(timer)
        }
        this.setData({second})
      }, 1000)
    })
  },
  bindPhone() {
    if (!this.data.canClick) return
    let data = {
      mobile: this.data.phone,
      code: this.data.code
    }
    app.phoneLogin(data).then(res => {
      app.wxToast({
        title: '登录成功',
        icon: 'success',
        callback() {
          if (wx.getStorageSync('choseType') === 'APPLICANT') {
            wx.navigateBack({
              delta: 1
            })
          } else {
            if (!res.data.token) {
              wx.reLaunch({
                url: `${RECRUITER}user/company/apply/apply`
              })
            } else {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        }
      })
    })
  },
  getPhoneNumber(e) {
    app.quickLogin(e)
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
    this.setData({
      second: 60
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearTimeout(timer)
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})