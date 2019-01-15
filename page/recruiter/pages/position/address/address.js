import {
  getAddressDetailApi,
  editCompanyAddressApi,
  addCompanyAddressApi
} from "../../../../../api/pages/company.js"

import {COMMON, RECRUITER} from '../../../../../config.js'

import { reverseGeocoder } from '../../../../../utils/map.js'

import {
  deleteCompanyAddressApi
} from '../../../../../api/pages/company.js'

const app = getApp()

Page({
  data: {
    id: '',
    area_id: '',
    doorplate: '',
    address: '',
    lng: '',
    lat: ''
  },
  onLoad(options) {
    this.setData({options})
  },
  onShow() {
    const options = this.data.options
    if(options.id) {
      getAddressDetailApi({id: options.id})
        .then(res => {
          const infos = res.data
          const formData = {
            id: infos.id,
            area_id: infos.areaId,
            address: infos.address,
            doorplate: infos.doorplate,
            lng: infos.lng,
            lat: infos.lat
          }
          Object.keys(formData).map(field => this.setData({[field]: formData[field]}))
        })
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-25
   * @detail   绑定用户输入
   * @return   {[type]}     [description]
   */
  bindInput(e) {
    this.setData({doorplate: e.detail.value})
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-28
   * @detail   选择地址
   * @return   {[type]}   [description]
   */
  selectAddress() {
    wx.chooseLocation({
      success: res => this.reverseGeocoder(res)
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
        const formData = {}
        formData.address = rtn.result.address
        formData.area_id = rtn.result.ad_info.adcode
        formData.lat = rtn.result.ad_info.location.lat
        formData.lng = rtn.result.ad_info.location.lng
        Object.keys(formData).map(field => this.setData({[field]: formData[field]}))
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
  submit() {
    const action = this.data.options.id ? 'edit' : 'post'
    this[action]()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-14
   * @detail   新增地址
   * @return   {[type]}   [description]
   */
  // post() {
  //   const storage = wx.getStorageSync('createPosition')
  //   storage.doorplate = this.data.doorplate
  //   wx.setStorageSync('createPosition', storage)
  //   wx.redirectTo({url: `${RECRUITER}position/post/post`})
  // },
  post() {
    const infos = this.data
    const formData = {
      areaId: infos.area_id,
      address: infos.address,
      doorplate: infos.doorplate,
      lng: infos.lng,
      lat: infos.lat,
      id: app.globalData.recruiterDetails.companyInfo.id
    }
    addCompanyAddressApi(formData)
      .then(res => {
        wx.navigateBack({delta: 1})
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-14
   * @detail   编辑地址
   * @return   {[type]}   [description]
   */
  edit() {
    const storage = wx.getStorageSync('createPosition')
    const infos = this.data
    const formData = {
      id: infos.id,
      areaId: storage.area_id !== infos.area_id ? storage.area_id : infos.area_id,
      address: storage.address !== infos.address  ? storage.address : infos.address,
      lng: storage.lng !== infos.lng ? storage.lng : infos.lng,
      lat: storage.lat !== infos.lat ? storage.lat : infos.lat,
      doorplate: infos.doorplate
    }
    editCompanyAddressApi(formData)
      .then(() => {
        wx.navigateBack({delta: 1})
      })
  }
})