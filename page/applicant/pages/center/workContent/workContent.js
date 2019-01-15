// page/applicant/pages/center/workContent/workContent.js
const app = getApp()
let workContent = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowInputNum: 0,
    cdnImagePath: app.globalData.cdnImagePath,
    showCase: false // 是否展示例子
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
  /* 切换例子 */
  nextExample () {
    console.log(1111)
  },
  /* 展示或关闭例子 */
  showPopups () {
    this.setData({
      showCase: !this.data.showCase
    })
  },
  /* 实时监听输入 */
  WriteContent (e) {
    workContent = e.detail.value
   this.setData({
     nowInputNum: e.detail.cursor
   })
  },
  send () {
    if (workContent) {
      wx.setStorageSync('workContent', workContent)
    } else {
      wx.showToast({
        title: '工作内容不能为空',
        icon: 'none',
        duration: 1000
      })
      return
    }
    wx.navigateBack({
      delta: 1
    })
  }
})