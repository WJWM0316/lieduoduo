import {COMMON, RECRUITER} from '../../../../../config.js'

import { reverseGeocoder } from '../../../../../utils/map.js'

import {
  deleteCompanyAddressApi
} from '../../../../../api/pages/company.js'

const app = getApp()

Page({
  data: {
    keyword: '',
    address: ''
  },
  onLoad(options) {
    const storage = wx.getStorageSync('createPosition')
    if(storage) {
      this.setData({ keyword: storage.doorplate, address: storage.address, options })
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
            this.setData({ keyword: storage.doorplate, address: storage.address })
          })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-09
   * @detail   删除公司地址
   * @return   {[type]}   [description]
   */
  deleteCompanyAddress() {
    deleteCompanyAddressApi({id: this.data.options.id})
      .then(() => {
        wx.redirectTo({url: `${RECRUITER}position/addressList/addressList`})
      })
  },
  save() {
    const storage = wx.getStorageSync('createPosition')
    storage.doorplate = this.data.keyword
    wx.setStorageSync('createPosition', storage)
    wx.redirectTo({url: `${RECRUITER}position/post/post`})
  }
})