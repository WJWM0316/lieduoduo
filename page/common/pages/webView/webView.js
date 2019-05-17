import {WEBVIEW} from '../../../../config.js'
const app = getApp()
let wxShare = {}
let options = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageUrl: '',
    cdnImagePath: app.globalData.cdnImagePath,
    navH: app.globalData.navHeight
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wxShare = {}
    options = options
    if (options.scene) options = app.getSceneParams(options.scene)
    let init = () => {
      let pageUrl = ''
      let sessionToken = wx.getStorageSync('sessionToken')
      let token = wx.getStorageSync('token')
      switch (options.type) {
        case 'recruitmentDay':
          pageUrl = `${WEBVIEW}available?sessionToken=${sessionToken}&token=${token}`
          wxShare = {
            title: '百亿资本加持下的风口新机遇火热来袭，顶级投资机构专场只等你来',
            path: '/page/common/pages/webView/webView?type=recruitmentDay',
            imageUrl: `${this.data.cdnImagePath}zpjShareBg_new.jpg`
          }
          app.readyStatistics({
            page: 'recruit_festival',
            channel: options.c || ''
          })
          break
        case 'userAgreement':
          pageUrl = `${WEBVIEW}userAgreement`
          break
      }
      this.setData({pageUrl})
    }
    if (app.loginInit) {
      init()
    } else {
      app.loginInit = () => {
        init()
      }
    }
  },
  getMessage (e) {
    console.log(e, 'h5返回的信息')
  },
  webLoad (e) {
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
  onShareAppMessage: function (options) {
    return app.wxShare({
      options,
      ...wxShare
    })
  }
})