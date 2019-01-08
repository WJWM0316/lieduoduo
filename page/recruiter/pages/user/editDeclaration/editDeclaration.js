import {setManifestoApi} from '../../../../../api/pages/recruiter.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: "",
    options: {},
    info: {}
  },
  changeVal(e) {
    this.setData({
      content: e.detail.value
    })
  },
  saveInfo() {
    let data = {
      id: this.data.options.id,
      topicId: 
      content: this.data.content
    }
    setManifestoApi(data).then(res => {
      getApp().wxToast({
        title: '保存成功',
        icon: 'success',
        callback() {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let info = app.globalData.recruiterDetails
    this.setData({options, info})
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