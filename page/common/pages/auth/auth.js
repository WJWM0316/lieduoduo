// page/common/pages/auth/auth.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onGotUserInfo(e) {
    console.lop(e, '9999999999999')
    if (e.detail.errMsg === 'getUserInfo:ok') {
      let data = {
        ssToken: wx.getStorageSync('sessionToken'),
        iv_key: e.detail.iv,
        data: e.detail.encryptedData
      }
      loginApi(data).then(res => {
        // 有token说明已经绑定过用户了
        if (res.data.token) {
          getApp().globalData.userInfo = res.data
          getApp().globalData.hasLogin = true
          wx.setStorageSync('token', res.data.token)
          wx.removeStorageSync('sessionToken')
          wx.reLaunch({
            url: `/${res.data.page}`
          })
        } else {
          console.log('用户为绑定')
        }
      })
    }
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