// page/applicant/pages/center/secondStep/secondStep.js
import { postSecondStepApi, postfirstStepApi } from '../../../../../api/pages/center'
import {APPLICANT,COMMON} from '../../../../../config.js'
let app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navHeight: app.globalData.navHeight,
    cdnImagePath: app.globalData.cdnImagePath,
    info: {
      companyName: '',
      positionType: {},
      startTimeDesc: '',
      endTimeDesc: '',
      duty: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let info = this.data.info
    let workContent = wx.getStorageSync('workContent')
    let createPosition = wx.getStorageSync('createPosition')
    let createUserSecond = wx.getStorageSync('createUserSecond')
    if (createUserSecond) {
      info = createUserSecond
    }
    info.duty = workContent
    info.positionType = createPosition
    this.setData({info})
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onHide: function () {
  },
  eidt () {
    wx.navigateTo({
     url: `${APPLICANT}center/workContent/workContent`
    })
  },
  jumpType() {
    wx.navigateTo({
     url: `${COMMON}category/category`
    })
  },
  getValue(e) {
    let info = this.data.info
    switch(e.currentTarget.dataset.type) {
      case 'companyName':
        info.companyName = e.detail.value
        break
    }
    this.setData({info})
  },
  getresult(val) {
    let info = this.data.info
    if (val.currentTarget.dataset.type === 'starTime') {
      info.starTime = val.detail.propsResult
      info.startTimeDesc = val.detail.propsDesc
    } else {
      info.endTime = val.detail.propsResult
      info.endTimeDesc = val.detail.propsDesc
    }
    this.setData({info})
  },
  submit() {
    let info = this.data.info
    let data = {
      company: info.companyName,
      positionType: info.positionType.typeName,
      positionTypeId: info.positionType.type,
      duty: info.duty,
      startTime: info.starTime,
      endTime: info.endTime
    }
    postSecondStepApi(data).then(res => {
      wx.setStorageSync('createUserSecond', info)
      wx.navigateTo({
        url: `${APPLICANT}center/educaExperience/educaExperience`
      })
    })
  }
})