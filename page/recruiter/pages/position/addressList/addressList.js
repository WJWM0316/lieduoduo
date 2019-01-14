import {getCompanyAddressListApi} from "../../../../../api/pages/company.js"
import {RECRUITER} from '../../../../../config.js'

Page({
  data: {
    addressList: [
      // {
      //   id: 1,
      //   active: false,
      //   title: '微信小程序前端开发工程师如果超长就…微信小程序前端开发工程师如果超长就…微信小程序前端开发工程师如果超长就…微信小程序前端开发工程师如果超长就…微信小程序前端开发工程师如果超长就…'
      // },
      // {
      //   id: 2,
      //   active: false,
      //   title: '微信小程序前端开发工程师如果超长就…微信小程序前端开发工程师如果超长就…微信小程序前端开发工程师如果超长就…微信小程序前端开发工程师如果超长就…微信小程序前端开发工程师如果超长就…'
      // },
      // {
      //   id: 3,
      //   active: false,
      //   title: '微信小程序前端开发工程师如果超长就…微信小程序前端开发工程师如果超长就…微信小程序前端开发工程师如果超长就…微信小程序前端开发工程师如果超长就…微信小程序前端开发工程师如果超长就…'
      // }
    ]
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
    const storage = wx.getStorageSync('createPosition')
    addressList.map((field, index) => {
      if(params.id === index) {
        field.active = true
        storage.address_id = field.id
        wx.setStorageSync('createPosition', storage)
      } else {
        field.active = false
      }
    })
    this.setData({addressList})
    setTimeout(() => {
      wx.navigateBack({delta: 1})
    }, 1500)
  },
  add() {
    wx.redirectTo({ url: `${RECRUITER}position/address/address` })
  },
  edit(e) {
    const params = e.currentTarget.dataset
    wx.redirectTo({ url: `${RECRUITER}position/address/address?id=${params.id}` })
    console.log(params)
  }
})