import {getCompanyAddressListApi} from "../../../../../api/pages/company.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      {
        title: '微信小程序前端开发工程师如果超长就…微信小程序前端开发工程师如果超长就…微信小程序前端开发工程师如果超长就…微信小程序前端开发工程师如果超长就…微信小程序前端开发工程师如果超长就…'
      },
      {
        title: '微信小程序前端开发工程师如果超长就…微信小程序前端开发工程师如果超长就…微信小程序前端开发工程师如果超长就…微信小程序前端开发工程师如果超长就…微信小程序前端开发工程师如果超长就…'
      },
      {
        title: '微信小程序前端开发工程师如果超长就…微信小程序前端开发工程师如果超长就…微信小程序前端开发工程师如果超长就…微信小程序前端开发工程师如果超长就…微信小程序前端开发工程师如果超长就…'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getCompanyAddressListApi().then(res => {
      console.log(res, 1111111)
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

  }
})