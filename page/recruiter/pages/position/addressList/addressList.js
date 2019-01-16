import {getCompanyAddressListApi, getPositionAddressListApi} from "../../../../../api/pages/company.js"
import {RECRUITER} from '../../../../../config.js'

Page({
  data: {
    addressList: [],
    options: {
      selected: false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({options})
  },
  onShow() {
    const options = this.data.options
    const action = options.type === 'position' ? 'getPositionAddressList' : 'getCompanyAddressList'
    this[action](options)
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-16
   * @detail   获取公司地址列表
   * @return   {[type]}   [description]
   */
  getCompanyAddressList(options) {
    getCompanyAddressListApi().then(res => {
      const addressList = res.data
      addressList.map(field => field.active = field.id === parseInt(options.addressId) ? true : false)
      this.setData({addressList: res.data})
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-16
   * @detail   获取职位地址列表
   * @return   {[type]}   [description]
   */
  getPositionAddressList(options) {
    getPositionAddressListApi().then(res => {
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
  /**
   * @Author   小书包
   * @DateTime 2019-01-16
   * @detail   添加地址
   */
  add() {
    // 判断是公司地址还是职位地址
    const options = this.data.options
    wx.navigateTo({url: `${RECRUITER}position/address/address?type=${options.type}&selected=${options.selected}`})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-16
   * @detail   编辑地址
   * @return   {[type]}     [description]
   */
  edit(e) {
    const params = e.currentTarget.dataset
    // 判断是公司地址还是职位地址
    const options = this.data.options
    wx.navigateTo({url: `${RECRUITER}position/address/address?id=${params.id}&type=${options.type}&selected=${options.selected}`})
  }
})