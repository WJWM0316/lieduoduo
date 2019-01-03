import {getPositionListApi} from "../../../../../api/pages/position.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = {
      recruiter: 90
    }
    getPositionListApi(data).then(res => {
      this.setData({items: res.data})
    })
  },
  radioChange(e) {
    let data = wx.getStorageSync('interviewData') || {}
    let job = e.detail.value.split(' ')
    data.positionName = job[0]
    data.positionId = job[1]
    wx.setStorageSync('interviewData', data)
    wx.navigateBack({
      delta: 1
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