import {getSelectorQuery} from "../../../../utils/util.js"
let positionTop = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    labels: ['你大爷的啊', '你大爷的啊', '你大爷的啊','你大爷的啊','你大爷的啊','你大爷的啊'],
    isShrink: false,
    btnTxt: '展开内容',
    isShowBtn: true
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
    getSelectorQuery('.msg').then(res => {
      if (res.height > 143) {
        this.setData({isShrink: true})
      }
    })
    getSelectorQuery(".mainContent .position").then(res => {
      positionTop = res.top - res.height * 2
    })
  },
  toggle() {
    let isShrink = this.data.isShrink
    let btnTxt = ''
    isShrink = !isShrink
    if (!isShrink) {
      btnTxt = '收起内容'
    } else {
      btnTxt = '展开内容'
    }
    this.setData({isShrink, btnTxt})
  },
  onPageScroll(e) { // 获取滚动条当前位置
    if (e.scrollTop >= positionTop) {
      if (!this.data.isShowBtn) return
      this.setData({isShowBtn: false})
    } else {
      if (this.data.isShowBtn) return
      this.setData({isShowBtn: true})
    }
  },
  /**
   *  
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