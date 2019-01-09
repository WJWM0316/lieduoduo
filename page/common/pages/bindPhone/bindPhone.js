import {COMMON,RECRUITER} from '../../../../config.js'
import {sendCodeApi, bindPhoneApi} from "../../../../api/pages/auth.js"
import {quickLoginApi} from '../../../../api/pages/auth.js'

let realCode = '' // 短信验证码
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    code: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // if (!app.globalData.userInfo) {
    //   wx.navigateTo({
    //     url: `${COMMON}auth/auth`
    //   })
    // }
  },
  getPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  getCode(e) {
    this.setData({
      code: e.detail.value
    })
  },
  sendCode() {
    if (this.data.phone === '') {
      app.wxToast({
        title: '请填写手机号'
      })
      return
    }
    let data = {
      mobile: this.data.phone
    }
    sendCodeApi(data).then(res => {
    })
  },
  bindSuccess() {
    app.globalData.hasLogin = true
    app.checkLogin()
    app.wxToast({
      title: '注册成功',
      icon: 'success',
      callback() {
        if (wx.getStorageSync('choseType') === 'APPLICANT') {
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.reLaunch({
            url: `${RECRUITER}user/company/apply/apply`
          })
        }
      }
    })
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
    bindPhoneApi(data).then(res => {
      wx.setStorageSync('token', res.data.token)
      app.globalData.userInfo = res.data
      this.bindSuccess()
    })
  },
  getPhoneNumber(e) {
    let data = {
      iv_key: e.detail.iv,
      data: e.detail.encryptedData
    }
    quickLoginApi(data).then(res => {
      wx.setStorageSync('token', res.data.token)
      app.globalData.userInfo = res.data
      this.bindSuccess()
    })
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