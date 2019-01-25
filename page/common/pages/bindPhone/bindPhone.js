import {COMMON,RECRUITER} from '../../../../config.js'
import {sendCodeApi, bindPhoneApi} from "../../../../api/pages/auth.js"
import {quickLoginApi} from '../../../../api/pages/auth.js'

let mobileNumber = 0
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    code: '',
    cdnImagePath: app.globalData.cdnImagePath,
    second: 60
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!app.globalData.userInfo) {
      wx.navigateTo({
        url: `${COMMON}auth/auth`
      })
    }
  },
  getPhone(e) {
    mobileNumber = e.detail.value
    this.setData({
      phone: e.detail.value
    })
    this.isBlured = true
    if (this.callback) {
      this.callback()
    }
  },
  getCode(e) {
    this.setData({
      code: e.detail.value
    })
  },
  sendCode() {
    let sendFun = () => {
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
        timer = setInterval(() => {
          second--
          if (second === 0) {
            second = 60
            clearInterval(timer)
          }
          this.setData({second})
        }, 1000)
      })
    }
    if (this.isBlured) {
      sendFun()
    } else {
      this.callback = () => {
        sendFun()
      }
    }
  },
  bindPhone() {
    let data = {
      mobile: this.data.phone,
      code: this.data.code
    }
    if (this.data.phone === '') {
      app.wxToast({
        title: '请填写手机号'
      })
      return
    }
    if (this.data.code === '') {
      app.wxToast({
        title: '请填写验证码'
      })
      return
    }
    app.phoneLogin(data).then(res => {
      app.wxToast({
        title: '注册成功',
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})