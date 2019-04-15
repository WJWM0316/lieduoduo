import wxAnimation from '../../../../utils/animation.js'
import {getSelectorQuery} from '../../../../utils/util.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: app.globalData.navHeight,
    cdnImagePath: app.globalData.cdnImagePath,
    animationData: {},
    step: 0, // 创建步数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animationData = animation
    let width = 0,
        height = 0
    switch (this.data.step) {
      case 0:
        getSelectorQuery('.start .content', this).then(res => {
          width = res.width
          height = res.height
          animation.translate3d(-width/2, -height/2, 0).step()
          console.log(res)
          this.setData({
            animationData: animation.export()
          })
        })
        break
    }
    
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