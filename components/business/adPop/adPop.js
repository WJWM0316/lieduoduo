const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    showPop: false,
    cdnImagePath: app.globalData.cdnImagePath
  },
  attached () {
    let curTime = new Date().getTime()
    let overdueTime = wx.getStorageSync('overdueTime')
    if (!overdueTime) {
      this.setData({showPop: true})
    } else {
      if (overdueTime < curTime) { // 已过期
        this.setData({showPop: true})
        wx.removeStorageSync('overdueTime')
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    jump () {
      wx.navigateTo({
        url: `/page/common/pages/webView/webView?type=recruitmentDay`
      })
      this.close()
    },
    close () {
      this.setData({showPop: false})
      let overdueTime = wx.getStorageSync('overdueTime')
      if (!overdueTime) {
        let curTime = new Date().getTime()
        let overdueTime= curTime + 24 * 3600 * 1000
        wx.setStorageSync('overdueTime', overdueTime)
      }
    }
  }
})
