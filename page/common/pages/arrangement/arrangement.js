import {interviewDetailApi, setInterviewDetailApi, sureInterviewApi} from "../../../../api/pages/interview.js"
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateList: [],
    identity: wx.getStorageSync('choseType'), // 身份标识
    options: {},
    appointmentId: '',
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
  changeVal(e) {
    let info = this.data.info
    if (e.currentTarget.dataset.type === 'name') {
      info.recruiterRealname = e.detail.value
    } else {
      info.recruiterMobile = e.detail.value
    }
    this.setData({info})
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
  radioChange(e) {
    let appointmentId = e.detail.value
    this.setData({appointmentId})
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
      dateList.push(new Date(item).getTime()/1000)
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
      app.wxConfirm({
        title: '发送成功',
        icon: 'success'
      })
      this.pageInit()
    })
  },
  revise() {
    let info = this.data.info
    let dateList = []
    info.arrangementInfo.appointmentList.map((item) => {
      dateList.push(item.appointment)
    })
    info.status = 21
    this.setData({info, dateList})
  },
  sureDate() {
    let data = {
      interviewId: this.data.options.id,
      appointmentId: this.data.appointmentId 
    }
    if(!this.data.appointmentId) {
      app.wxToast({title: '请选择一个面试时间'})
      return;
    }
    sureInterviewApi(data).then(res => {
      app.wxConfirm({
        title: '确定成功',
        icon: 'success'
      })
      this.pageInit()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({options, identity: wx.getStorageSync('choseType')})
    this.pageInit()
  },
  pageInit() {
    interviewDetailApi({interviewId: this.data.options.id}).then(res => {
      if(res.data.arrangementInfo) {
        this.setData({info: res.data, dateList: res.data.arrangementInfo.appointmentList})
      } else {
        this.setData({info: res.data})
      }
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