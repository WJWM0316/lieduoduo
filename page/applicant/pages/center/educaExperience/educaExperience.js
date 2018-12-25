// page/applicant/pages/center/thirdStep/thirdStep.js
import { postThirdStepApi } from '../../../../../api/pages/center'
let degree =''
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
  /* 学历选择结果 */
  getresult(val) {
    degree = val.detail.propsDesc
  },
  formSubmit (e) {
    e.detail.value.degree = degree
    postThirdStepApi(e.detail.value).then(res => {
      wx.navigateTo({
        url: '/page/applicant/pages/center/mine/mine'
      })
    }).catch (err => {
      console.log(err, '88888888888888888')
    })
  }
})