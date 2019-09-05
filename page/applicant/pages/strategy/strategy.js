const app = getApp() 
import {APPLICANT} from '../../../../config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cdnImagePath: app.globalData.cdnImagePath,
    telePhone: app.globalData.telePhone,
    isJobhunter: 0,
    list: [],
    hideLoginBox: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let list = wx.getStorageSync('strategyData'),
        isJobhunter = app.globalData.isJobhunter
    this.setData({list, isJobhunter}, () => {
      wx.removeStorageSync('strategyData')
    })
  },
  routeJump (e) {
    let from = e.currentTarget.dataset.from
    if (this.data.isJobhunter) {
      wx.navigateBack({
        delta: 1
      })
    } else {
      if (!app.globalData.hasLogin) {
        this.setData({hideLoginBox: false})
        return
      }
      wx.navigateTo({
        url: `${APPLICANT}createUser/createUser?from=${from}`
      })
    }
  },
  call () {
    wx.makePhoneCall({
      phoneNumber: this.data.telePhone
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

  }
})