import {getTopicListApi} from '../../../../../api/pages/recruiter.js'
import {RECRUITER} from '../../../../../config.js'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    myTopList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let myTopList = app.globalData.recruiterDetails.manifestos
    getTopicListApi().then(res => {
      this.setData({list: res.data})
    })
  },
  addTop(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `${RECRUITER}user/editDeclaration/editDeclaration?topicId=${item.id}&title=${item.title}`
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