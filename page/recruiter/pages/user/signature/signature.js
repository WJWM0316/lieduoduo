const app = getApp()
let value = '',
    timer = null
Page({
  data: {
    nav: app.globalData.navHeight,
    cdnPath: app.globalData.cdnImagePath,
    value: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    value = ''
  },
  bindinput (e) {
    value = e.detail.value
    clearTimeout(timer)
    timer = setTimeout(() => {
      this.setData({value})
    }, 100)
  },
  save () {
    if (!value) {
      app.wxToast({title: '请填写您的个性签名！'})
      return
    }
    if (value.length < 6 || value.length > 30) {
      app.wxToast({title: '个性签名需为6~30个字符！'})
      return
    }
    wx.setStorageSync('saveSignature', value)
    wx.navigateBack({
      delta: 1
    })
  }
})