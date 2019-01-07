import {COMMON,APPLICANT,RECRUITER} from '../../../../../config.js'
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
      }
    })
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
    getResumeStepApi().then(res => {
      if (!res.data.isFinished) {
        let step = ''
        switch (res.data.step){
          case 2:
            step = '/page/applicant/pages/center/workExperience/workExperience'
            break;
          case 3:
            step = '/page/applicant/pages/center/educaExperience/educaExperience'
            break;
          default : 
            step = '/page/applicant/pages/center/createUser/createUser'
            break;
        }
        wx.navigateTo({
          url: step
        })
      }
    })
  },
  /* 编辑简历 */
  toEdit () {
    wx.navigateTo({
      url: '/page/applicant/pages/center/userInfoEdit/userInfoEdit',
    })
  }
})