import {COMMON, RECRUITER} from '../../../../../config.js'

import { reverseGeocoder } from '../../../../../utils/map.js'

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
  /**
   * @Author   小书包
   * @DateTime 2018-12-28
   * @detail   选择地址
   * @return   {[type]}   [description]
   */
  selectAddress() {
    wx.chooseLocation({
      success: res => {
        this.reverseGeocoder(res)
      },
      fail(e) {
        console.log(e)
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-28
   * @detail   转换地址信息
   * @return   {[type]}       [description]
   */
  reverseGeocoder(res) {
    const storage = wx.getStorageSync('createPosition')
    reverseGeocoder(res)
          .then(rtn => {
            storage.address = rtn.result.address
            storage.area_id = rtn.result.ad_info.adcode
            storage.lat = rtn.result.ad_info.location.lat
            storage.lng = rtn.result.ad_info.location.lng
            wx.setStorageSync('createPosition', storage)
          })
          .catch(() => {
            app.wxToast({title: '地址转化失败'})
          })
  },
  submit(e) {
    const storage = wx.getStorageSync('createPosition')
    storage.doorplate = this.data.keyword
    wx.setStorageSync('createPosition', storage)
    wx.redirectTo({url: `${RECRUITER}position/post/post`})
  }
})