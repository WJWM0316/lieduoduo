import {COMMON, RECRUITER} from '../../../../../config.js'

const app = getApp()

Page({
  data: {
    keyword: ''
  },
  onLoad() {
    const storage = wx.getStorageSync('createPosition')
    if(storage) {
      this.setData({ keyword: storage.doorplate })
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-25
   * @detail   绑定用户输入
   * @return   {[type]}     [description]
   */
  bindInput(e) {
    this.setData({keyword: e.detail.value})
  },
  selectAddress() {
    wx.navigateTo({url: `${COMMON}map/map`})
  },
  submit(e) {
    const storage = wx.getStorageSync('createPosition')
    storage.doorplate = this.data.keyword
    wx.setStorageSync('createPosition', storage)
    wx.navigateTo({url: `${RECRUITER}position/post/post`})
  }
})