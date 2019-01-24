import {interviewDetailApi, setInterviewDetailApi, sureInterviewApi} from "../../../../api/pages/interview.js"
import {COMMON,APPLICANT,RECRUITER} from "../../../../config.js"
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    identity: "", // 身份标识
    options: {},
    appointmentId: '',
    info: {}
  },
  getResult(e) {
    let date = e.detail.propsResult
    let curDate = new Date().getTime() / 1000
    if (curDate > date) {
      getApp().wxToast({
        title: '面试时间必须晚于当前时间'
      })
      return
    }
    let info = this.data.info
    let hasFilter = false
    if (!info.arrangementInfo) {
      info.arrangementInfo = {}
      info.arrangementInfo.appointmentList = []
    }
    info.arrangementInfo.appointmentList.map((item, index) => {
      if (item.appointmentTime === date) {
        getApp().wxToast({
          title: '面试时间重复'
        })
        hasFilter = true
        return
      }
    })
    if (hasFilter) return
    info.arrangementInfo.appointmentList.push({appointmentTime:date})
    this.setData({info})
  },
  changeVal(e) {
    let info = this.data.info
    if (e.currentTarget.dataset.type === 'name') {
      info.recruiterInfo.realname = e.detail.value
    } else {
      info.recruiterInfo.mobile = e.detail.value
    }
    this.setData({info})
  },
  jump(e) {
    let url = ''
    let info = this.data.info
    switch(e.currentTarget.dataset.type) {
      case 'jobList':
        url = `${RECRUITER}position/jobList/jobList?recruiterUid=${info.recruiterInfo.uid}`
        break
      case 'addressList':
        url = `${RECRUITER}position/addressList/addressList?type=position&selected=1`
        break
      case 'position':
        url = `${COMMON}positionDetail/positionDetail?positionId=${info.positionId}`
        break
      case 'map':
        url = `${COMMON}positionDetail/positionDetail?positionId=${info.positionId}`
        break
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
    let index = e.currentTarget.dataset.index
    let info = this.data.info
    info.arrangementInfo.appointmentList.splice(index, 1)
    this.setData({info})
  },
  send() {
    let info = this.data.info
    let dateList = []
    info.arrangementInfo.appointmentList.map((item, index) => {
      dateList.push(item.appointmentTime)
    })
    let data = {
      interviewId: this.data.options.id,
      realname: info.recruiterInfo.realname,
      mobile: info.recruiterInfo.mobile,
      positionId: info.positionId,
      addressId: info.addressId,
      interviewTime: dateList.join(',')
    }
    setInterviewDetailApi(data).then(res => {
      wx.removeStorageSync('interviewData')
      wx.removeStorageSync('createPosition')
      app.wxToast({
        title: '发送成功',
        icon: 'success'
      })
      this.pageInit()
    })
  },
  revise() {
    let info = this.data.info
    info.status = 21
    this.setData({info})
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
    this.setData({options})
    this.pageInit()
  },
  pageInit() {
    interviewDetailApi({interviewId: this.data.options.id}).then(res => {
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
    let positionData = wx.getStorageSync('interviewData')
    let addressData = wx.getStorageSync('createPosition')
    let identity = wx.getStorageSync('choseType')
    let info = this.data.info
    if (positionData) {
      info.positionName = positionData.positionName
      info.positionId = positionData.positionId
    }
    if (addressData) {
      info.address = addressData.address
      info.addressId = addressData.address_id
    }
    this.setData({identity, info})
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