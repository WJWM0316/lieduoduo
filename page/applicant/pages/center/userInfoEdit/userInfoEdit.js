import {editBaseInfoApi} from '../../../../../api/pages/center.js'
let app = getApp()
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
    let info = app.globalData.resumeInfo
    this.setData({info})
  },
  jumpLabel() {
    wx.navigateTo({
      url: `/page/common/pages/tabsPage/tabsPage`
    })
  },
  radioChange(e) {
    this.setData({gender: parseInt(e.detail.value)})
  },
  getResult(e) {
    let info = this.data.info
    switch (e.target.dataset.type) {
      case 'birthday':
        info.birth = e.detail.propsResult
        info.birthDesc = e.detail.propsDesc
        break
      case 'workTime':
        info.startWorkYear = e.detail.propsResult
        info.startWorkYearDesc = e.detail.propsDesc
        break
      case 'jobStatus':
        info.jobStatus = e.detail.propsResult
        info.jobStatusDesc = e.detail.propsDesc
        break
    }
    this.setData({info})
  },
  getInputValue(e) {
    let info = this.data.info
    switch (e.target.dataset.type) {
      case 'name':
        info.name = e.detail.propsResult
        break
      case 'mobile':
        info.mobile = e.detail.propsResult
        break
      case 'wechat':
        info.wechat = e.detail.propsResult
        break
    }
    this.setData({info})
  },
  singInput(e) {
    let info = this.data.info
    info.signature = e.detail.value
    this.setData({info})
  },
  saveInfo() {
    let info = this.data.info
    let data = {
      avatar: info.avatar.id,
      name: info.name,
      gender: info.gender,
      birth: info.birth,
      startWorkYear: info.startWorkYear,
      jobStatus: info.jobStatus,
      mobile: info.mobile,
      wechat: info.wechat,
      signature: info.signature
    }
    editBaseInfoApi(data).then(res => {
      app.wxToast({
        title: '保存成功',
        icon: 'success',
        callback() {
          wx.navigateBack({
            delta: 1
          })
          wx.removeStorageSync('avatar')
        }
      })
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
    let info = this.data.info
    let avatar = wx.getStorageSync('avatar')
    if (avatar) {
      info.avatar = avatar
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