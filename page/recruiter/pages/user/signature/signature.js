const app = getApp()
let value = '',
    timer = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: app.globalData.navHeight,
    cdnPath: app.globalData.cdnImagePath,
    value: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    value = ''
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  bindinput (e) {
    value = e.detail.value
    clearTimeout(timer)
    timer = setTimeout(() => {
      this.setData({value})
    }, 100)
  },
  save () {
    if (!value) {
      app.wxToast({title: '请填写您的个性签名！'})
      return
    }
    wx.setStorageSync('saveSignature', value)
    wx.navigateBack({
      delta: 1
    })
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