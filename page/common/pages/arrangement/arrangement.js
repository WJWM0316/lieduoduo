import {interviewDetailApi, setInterviewDetailApi} from "../../../../api/pages/interview.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateList: ['2018-02-05 13:30', '2018-02-05 13:31'],
    options: {},
    info: {}
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
  jump(e) {
    let url = ''
    if (e.currentTarget.dataset.type === 'jobList') {
      url = '/page/recruiter/pages/position/jobList/jobList'
    } else if (e.currentTarget.dataset.type === 'addressList') {
      url = '/page/recruiter/pages/position/addressList/addressList'
    }
    wx.navigateTo({
      url: url
    })
  },
  removeDate(e) {
    let dateList = this.data.dateList
    let index = e.currentTarget.dataset.index
    dateList.splice(index, 1)
    this.setData({dateList})
  },
  send() {
    let dateList = []
    this.data.dateList.map((item, index) => {
      dateList.push(new Date(item).getTime())
    })
    dateList = dateList.join(",")
    let info = this.data.info
    let data = {
      interviewId: this.data.options.id,
      realname: info.recruiterRealname,
      mobile: info.recruiterMobile,
      positionId: info.positionId,
      interviewTime: dateList
    }
    setInterviewDetailApi(data).then(res => {
      console.log(res)
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({options})
    interviewDetailApi({interviewId: options.id}).then(res => {
      this.setData({info: res.data})
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
    let data = wx.getStorageSync('interviewData') || {}
    let info = this.data.info
    if (data) {
      info.positionName = data.positionName
      info.positionId = data.positionId
      this.setData({info})
    }
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