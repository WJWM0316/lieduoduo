import {getCompanyAddressListApi} from "../../../../../api/pages/company.js"
import {RECRUITER} from '../../../../../config.js'

Page({
  data: {
    addressList: [],
    isSelected: false,
    options: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    this.setData({options})
  },
  onShow() {
    const options = this.data.options
    getCompanyAddressListApi().then(res => {
      const addressList = res.data
      addressList.map(field => field.active = field.id === parseInt(options.addressId) ? true : false)
      this.setData({addressList: res.data})
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
        storage.address = field.address
        wx.setStorageSync('createPosition', storage)
      } else {
        field.active = false
      }
    })
    this.setData({addressList}, () => {
      wx.navigateBack({delta: 1})
    })
  },
  add() {
    const type = this.data.options.type ? this.data.options.type : ''
    wx.navigateTo({ url: `${RECRUITER}position/address/address?type=${type}` })
  },
  edit(e) {
    const params = e.currentTarget.dataset
    wx.navigateTo({ url: `${RECRUITER}position/address/address?id=${params.id}` })
  }
})