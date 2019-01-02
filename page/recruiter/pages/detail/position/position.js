import {
  getPositionApi
} from '../../../../../api/pages/position.js'

import {RECRUITER} from '../../../../../config.js'

Page({
  data: {
    detail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({query: options})
    getPositionApi({id: options.positionId})
      .then(res => {
        this.setData({detail: res.data})
      })
  },
  onShareAppMessage() {},
  edit() {
    wx.navigateTo({url: `${RECRUITER}position/post/post?positionId=${this.data.query.positionId}`})
  }
})