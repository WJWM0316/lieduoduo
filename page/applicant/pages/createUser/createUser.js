import wxAnimation from '../../../../utils/animation.js'
import {getSelectorQuery} from '../../../../utils/util.js'
const app = getApp()
let timer = null,
    duration = 800 // 过场动画时间
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: app.globalData.navHeight,
    isBangs: app.globalData.isBangs,
    cdnImagePath: app.globalData.cdnImagePath,
    animationData: {},
    step: 0, // 创建步数
    active: null,
    avatar: {},
    gender: '1',
    workTimeDesr: '',
    workCurrent: 0,
    workDate: [
      {},
      {}
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  progress (step) {
    console.log(step)
    this.setData({step}, () => {
      this.setData({active: step})
      timer = setTimeout(() => {
        step++
        if (step > 3) {
          clearTimeout(timer)   
        } else {
          this.progress(step)
        }
      }, duration)
    })
  },
  toggle (e) {
    let workCurrent = this.data.workCurrent
    switch (e.currentTarget.dataset.type) {
      case 'next':
        workCurrent++
        if (workCurrent > this.data.workDate.length - 1) workCurrent = 0
        this.setData({workCurrent})
        break
      case 'prev':
        workCurrent--
        if (workCurrent < 0) workCurrent = this.data.workDate.length - 1
        this.setData({workCurrent})
        break
      case 'change':
        console.log(e, 11111111111111)
        break
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let step = this.data.step
    this.progress(step)
  },
  getresult (val) {
    this.setData({workTimeDesr: val.detail.propsDesc, startWorkYear: val.detail.propsResult})
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let avatar = wx.getStorageSync('avatar')
    if (avatar) {
      this.setData({avatar})
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