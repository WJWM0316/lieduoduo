import {
  getAddressDetailApi,
  editCompanyAddressApi,
  editPositionAddressApi ,
  addCompanyAddressApi,
  addPositionAddressApi,
  deletePositionAddressApi,
  deleteCompanyAddressApi
} from "../../../../../api/pages/company.js"

import {COMMON, RECRUITER} from '../../../../../config.js'

import { reverseGeocoder } from '../../../../../utils/map.js'

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
  // onShow() {
  //   const options = this.data.options
  //   if(options.id) {
  //     getAddressDetailApi({id: options.id})
  //       .then(res => {
  //         const infos = res.data
  //         const formData = {
  //           id: infos.id,
  //           area_id: infos.areaId,
  //           address: infos.address,
  //           doorplate: infos.doorplate,
  //           lng: infos.lng,
  //           lat: infos.lat
  //         }
  //         Object.keys(formData).map(field => this.setData({[field]: formData[field]}))
  //       })
  //   }
  // },
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
    wx.chooseLocation({success: res => this.reverseGeocoder(res)})
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
   * @DateTime 2019-01-15
   * @detail   删除地址
   * @return   {[type]}   [description]
   */
  delete() {
    const type = this.data.options.type === 'position' ? 'Position' : 'Company'
    const action = `delete${type}Address`
    this[action]()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-15
   * @detail   编辑地址
   * @return   {[type]}   [description]
   */
  edit() {
    const type = this.data.options.type === 'position' ? 'Position' : 'Company'
    const action = `edit${type}Address`
    this[action]()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-15
   * @detail   新增地址
   * @return   {[type]}   [description]
   */
  post() {
    const type = this.data.options.type === 'position' ? 'Position' : 'Company'
    const action = `post${type}Address`
    this[action]()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-15
   * @detail   提交地址
   * @return   {[type]}   [description]
   */
  submit() {
    const action = this.data.options.id ? 'edit' : 'post'
    this[action]()
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
        wx.navigateBack({delta: 1})
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-09
   * @detail   删除职位地址
   * @return   {[type]}   [description]
   */
  deletePositionAddress() {
    deleteCompanyAddressApi({id: this.data.options.id})
      .then(() => {
        wx.navigateBack({delta: 1})
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-15
   * @detail   添加职位地址
   * @return   {[type]}   [description]
   */
  postPositionAddress() {
    const infos = this.data
    const formData = {
      areaId: infos.area_id,
      address: infos.address,
      doorplate: infos.doorplate,
      lng: infos.lng,
      lat: infos.lat
    }
    addPositionAddressApi(formData)
      .then(res => {
        wx.navigateBack({delta: 1})
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-15
   * @detail   添加公司地址
   * @return   {[type]}   [description]
   */
  postCompanyAddress() {
    const infos = this.data
    const formData = {
      area_id: infos.area_id,
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
   * @detail   编辑职位地址
   * @return   {[type]}   [description]
   */
  editPositionAddress() {
    const infos = this.data
    const formData = {
      id: infos.id,
      areaId: infos.area_id,
      address: infos.address,
      lng: infos.lng,
      lat: infos.lat,
      doorplate: infos.doorplate
    }
    editPositionAddressApi(formData)
      .then(() => {
        wx.navigateBack({delta: 1})
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-14
   * @detail   编辑公司地址
   * @return   {[type]}   [description]
   */
  editCompanyAddress() {
    const infos = this.data
    const formData = {
      id: infos.id,
      area_id: infos.area_id,
      address: infos.address,
      lng: infos.lng,
      lat: infos.lat,
      doorplate: infos.doorplate
    }
    editCompanyAddressApi(formData)
      .then(() => {
        wx.navigateBack({delta: 1})
      })
  }
})