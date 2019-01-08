import {getPositionListApi} from "../../../../../api/pages/position.js"

import {
  applyInterviewApi,
  confirmInterviewApi,
  refuseInterviewApi
} from '../../../../../api/pages/interview.js'

import {RECRUITER, COMMON} from '../../../../../config.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    options: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const storage = wx.getStorageSync('interviewChatLists')
    let data = {
      recruiter: options.recruiterUid
    }
    if(storage) {
      this.setData({items: storage.data, options})
      return;
    }
    getPositionListApi(data).then(res => {
      this.setData({items: res.data, options})
    })
  },
  radioChange(e) {
    let data = wx.getStorageSync('interviewData') || {}
    let job = e.detail.value.split(' ')
    data.positionName = job[0]
    data.positionId = job[1]
    wx.setStorageSync('interviewData', data)
    if(this.data.options.type === 'chat') {
      applyInterviewApi({jobhunterUid: this.data.options.jobhunterUid, positionId: job[1]})
        .then(res => {
          wx.navigateTo({
            url: `${COMMON}resumeDetail/resumeDetail?uid=${this.data.options.jobhunterUid}`
          })
        })
    } else if(this.data.options.type === 'confirm_chat') {
      confirmInterviewApi({id: job[1]})
        .then(res => {
          wx.navigateBack({delta: 1})
         wx.removeStorageSync('interviewChatLists')
        })
    } else if(this.data.options.type === 'reject_chat') {
      refuseInterviewApi({id: job[1]})
        .then(res => {
          wx.navigateBack({delta: 1})
         wx.removeStorageSync('interviewChatLists')
        })
    } else {
      wx.navigateBack({delta: 1})
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