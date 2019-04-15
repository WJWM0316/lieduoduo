const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    pageUrl: '',
    navH: app.globalData.navHeight
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pageUrl = ''
    let title = ''
    let sessionToken = wx.getStorageSync('sessionToken')
    switch (options.type) {
      case 'recruitmentDay':
        pageUrl = `https://m.lieduoduo.ziwork.com/available?sessionToken=${sessionToken}`//`https://m.lieduoduo.ziwork.com/available?sessionToken=${sessionToken}`//
        title = '猎多多招聘节'
        break
    }
    this.setData({pageUrl, title})
  },
  getMessage (e) {
    console.log(e, 'h5返回的信息')
  },
  webLoad (e) {
    console.log(e, 11111111111111111)
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