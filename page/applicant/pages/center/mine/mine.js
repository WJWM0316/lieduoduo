import {COMMON,APPLICANT,RECRUITER} from '../../../../../config.js'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isComplete: false,
    myInfo: {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let myInfo = app.globalData.resumeInfo
    let isComplete = this.data.isComplete
    if (myInfo.uid) {
      isComplete = true
    }
    this.setData({myInfo, isComplete})
  },
  preview() {
    wx.downloadFile({
      url: 'https://lieduoduo-uploads-test.oss-cn-shenzhen.aliyuncs.com/front-assets/file/111.pdf',
      success(res) {
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath,
          success(res) {
            console.log('打开文档成功')
          }
        })
      },
      fail(e) {
        console.log(e)
      }
    })
  },
  jump(e) {
    switch(e.currentTarget.dataset.type) {
      case "settings":
        wx.navigateTo({
          url: `${COMMON}settings/settings`
        })
        break
    }
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

  },
  /* 去完善简历 */
  completeResume () {
    wx.navigateTo({
      url: `${APPLICANT}center/createUser/createUser`
    })
  },
  /* 编辑简历 */
  toEdit () {
    wx.navigateTo({
      url: `${COMMON}resumeDetail/resumeDetail`,
    })
  }
})