// page/applicant/pages/center/secondStep/secondStep.js
import { postSecondStepApi, postfirstStepApi } from '../../../../../api/pages/center'
import {APPLICANT,COMMON} from '../../../../../config.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    info: {}
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
    let createUserSecond = wx.getStorageSync('createUserSecond')
    if (workContent && createUserSecond) {
      info = createUserSecond
      info.workContent = workContent
      this.setData({info})
    } else if (workContent) {
      info.workContent = workContent
      this.setData({info})
    }
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
    } else {
      info.endTime = val.detail.propsResult
    }
    this.setData({info})
  },
  submit() {
    let info = this.data.info
    let data = {
      company: info.companyName,
      positionType: info.positionType,
      duty: info.duty,
      startTime: info.startTime,
      endTime: info.endTime
    }
    postSecondStepApi(data).then(res => {
      wx.setStorageSync('createUserSecond', info)
      wx.navigateTo({
        url: '/page/applicant/pages/center/educaExperience/educaExperience'
      })
    })
  }
})