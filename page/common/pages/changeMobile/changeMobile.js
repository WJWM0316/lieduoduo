import {COMMON,RECRUITER} from '../../../../config.js'
import {sendCodeApi, changePhoneApi} from "../../../../api/pages/auth.js"
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    phone: '',
    code: '',
    second: 60
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let mobile = app.globalData.resumeInfo.mobile || app.globalData.recruiterDetails.mobile
    this.setData({mobile})
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
  },
  bindPhone() {
    let data = {
      mobile: this.data.phone,
      code: this.data.code,
    }
    changePhoneApi(data).then(res => {
      app.wxToast({
        title: '修改成功',
        icon: 'success'
      })
      wx.navigateBack({
        delta: 1
      })
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