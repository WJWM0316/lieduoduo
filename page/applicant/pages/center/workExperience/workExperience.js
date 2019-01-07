// page/applicant/pages/center/secondStep/secondStep.js
import { postSecondStepApi, postfirstStepApi } from '../../../../../api/pages/center'
let starTime = ''
let endTime = ''
Page({
  /**
   * 页面的初始数据
   */
  data: {
    
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
    
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onHide: function () {
    wx.removeStorageSync('workContent')
  },
  eidt () {
    wx.navigateTo({
     url: '/page/applicant/pages/center/workContent/workContent'
    })
  },

  getresult(val) {
    if (val.currentTarget.dataset.type === 'starTime') {
      starTime = val.detail.propsResult
    } else {
      endTime = val.detail.propsResult
    }
  },
  
  formSubmit (e) {
    e.detail.value.startTime = starTime
    e.detail.value.endTime = endTime
    e.detail.value.duty = wx.getStorageSync('workContent')
    postSecondStepApi(e.detail.value).then(res => {
      wx.navigateTo({
        url: '/page/applicant/pages/center/educaExperience/educaExperience'
      })
    }).catch (err => {
      console.log(err, '88888888888888888')
    })
  }
})