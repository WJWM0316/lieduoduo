// page/recruiter/pages/interview/arrangement/arrangement.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateList: ['2018-02-05 13:30', '2018-02-05 13:30']
  },
  getResult(e) {
    let date = e.detail.propsDesc
    let dateList = this.data.dateList
    if (dateList.indexOf(date) !== -1) {
      getApp().wxToast({
        title: '面试时间重复'
      })
      return
    }
    dateList.push(date)
    this.setData({dateList})
  },
  removeDate(e) {
    let dateList = this.data.dateList
    let index = e.currentTarget.dataset.index
    dateList.splice(index, 1)
    this.setData({dateList})
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