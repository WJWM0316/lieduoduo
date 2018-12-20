// page/applicant/pages/mine/mine.js
import { getBaseInfoApi, getResumeStepApi, getMyInfoApi } from '../../../../../api/pages/center'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isComplete: false,
    isLogin: true,
    myInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     getMyInfoApi().then(res => {
      this.setData({
        isComplete: true,
        myInfo: res.data
      })
    }).catch(err => {
      // 为完善简历
      if (err.code === 701) {
        this.setData({
          isComplete: false
        })
        this.init()
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
  
  init () {
    getResumeStepApi().then(res => {
      console.log(res, '5555555555555555')
    })
  },
  /* 去完善简历 */
  completeResume () {
    getResumeStepApi().then(res => {
      if (!res.data.isFinished) {
        let step = ''
        switch (res.data.step){
          case 2:
            step = '/page/applicant/pages/center/secondStep/secondStep'
            break;
          case 3:
            step = '/page/applicant/pages/center/thirdStep/thirdStep'
            break;
          default : 
            step = '/page/applicant/pages/center/firstStep/firstStep'
            break;
        }
        wx.navigateTo({
          url: step
        })
      }
    })
  }
})