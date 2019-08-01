import {getRapidlyApi} from '../../../../api/pages/specialJob.js'
import {getSelectorQuery} from '../../../../utils/util.js'
const app = getApp() 
let tabTop = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: app.globalData.navHeight,
    cdnImagePath: app.globalData.cdnImagePath,
    listData: {
      list: [],
      page: 0,
      count: app.globalData.count,
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    },
    otherData: {},
    tabFixed: false,
    navFixed: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRapidly()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.nextTick(() => {
      getSelectorQuery('.tab').then(res => {
        tabTop = res.top
      })
    })
  },
  getRapidly () {
    let listData = this.data.listData,
        params = {
          page: listData.pageNum,
          count: listData.count,
        }
    getRapidlyApi(params).then(res => {
      let list = res.item,
          isLastPage = listData.isLastPage
      params.page++
      if (!listData.isLastPage && res.meta && res.meta.nextPageUrl) isLastPage = true
      this.setData({
        `listData['page']`: params.page,
        `listData['isRequire']`: true,
        `listData['isLastPage']`: isLastPage
      })
      
    })
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
  onPageScroll(e) {
    if (e.scrollTop > 0) {
      if (!this.data.navFixed) this.setData({navFixed: true})
    } else {
      if (this.data.navFixed) this.setData({navFixed: false})
    }
    if (e.scrollTop > tabTop) {
     if (!this.data.tabFixed) this.setData({tabFixed: true})
    } else {
      if (this.data.tabFixed) this.setData({tabFixed: false})
    }
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