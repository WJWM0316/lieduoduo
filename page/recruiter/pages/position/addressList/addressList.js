import {getCompanyAddressListApi} from "../../../../../api/pages/company.js"
import {RECRUITER} from '../../../../../config.js'

Page({
  data: {
    addressList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    getCompanyAddressListApi().then(res => {
      const addressList = res.data
      addressList.map(field => {
        if(field.id === parseInt(options.addressId)) {
          field.active = true
        } else {
          field.active = false
        }
      })
      this.setData({addressList: res.data})
      console.log(res.data)
    })
  },
  onClick(e) {
    const params = e.currentTarget.dataset
    const addressList = this.data.addressList
    const storage = wx.getStorageSync('createPosition') || {}
    addressList.map((field, index) => {
      if(params.id === index) {
        field.active = true
        storage.address_id = field.id
        storage.address_name = field.address
        wx.setStorageSync('createPosition', storage)
      } else {
        field.active = false
      }
    })
    this.setData({addressList})
    wx.navigateBack({delta: 1})
  },
  add() {
    wx.redirectTo({ url: `${RECRUITER}position/address/address` })
  },
  edit(e) {
    const params = e.currentTarget.dataset
    wx.redirectTo({ url: `${RECRUITER}position/address/address?id=${params.id}` })
  }
})