import {
  getAreaListApi,
} from '../../../../api/pages/label.js'
import {getCityLabelApi} from '../../../../api/pages/common.js'

let app = getApp()

Page({
  data: {
    cityList: [],
    hotArea: [],
    query: '',
    statusBarHeight: app.globalData.navHeight,
    index1: 0,
    index2: 0,
    showMask: false,
    searing: false
  },
  onLoad(options) {
    this.setData({query: options})
    this.getLists()
  },
  getLists() {
    getCityLabelApi().then(res => {
      let hotArea = res.data
      let selectCity = wx.getStorageSync('selectCity')
      if (selectCity) {
        hotArea.forEach(field => {
          if (field.areaId === selectCity) {
            field.active = true
          }
        })
      }
      this.setData({hotArea}, () => {
        wx.removeStorageSync('selectCity')
      })
    })
    getAreaListApi().then(res => {
      this.setData({cityList: res.data})
    })
  },
  onClick(e) {
    let params = e.currentTarget.dataset
    let storage = wx.getStorageSync('createPosition') || {}
    storage.type = params.labelId
    storage.typeName = params.name
    if(params.topid !== storage.parentType) storage.skills = []
    storage.parentType = params.topid
    wx.setStorageSync('createPosition', storage)
    wx.navigateBack({delta: 1})
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-25
   * @detail   一级选中
   * @return   {[type]}     [description]
   */
  onClick1(e) {
    // 只有一级标签
    let params = e.currentTarget.dataset
    let cityList = this.data.cityList
    cityList.map((field, index) => field.active = index === params.index ? true : false)
    cityList[params.index].children.map((field, index) => field.active = index === this.data.index1 ? true : false)
    // cityList[params.index].children[this.data.index1].children[this.data.index2].active = true
    this.setData({index1: params.index, cityList, showMask: true})
    let selectCityName = cityList[params.index].title
    if (selectCityName === '北京市' || selectCityName === '天津市' || selectCityName === '上海市' || selectCityName === '重庆市') {
      let selectCity = cityList[params.index].children[0]
      wx.setStorageSync('selectCity', selectCity)
      wx.navigateBack({delta: 1})
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-25
   * @detail   一级选中
   * @return   {[type]}     [description]
   */
  onClick2(e) {
    let params = e.currentTarget.dataset
    let cityList = this.data.cityList
    cityList[this.data.index1].children.map((field, index) => field.active = index === params.index ? true : false)
    this.setData({index2: params.index, cityList, showMask: true})
    let selectCity = cityList[this.data.index1].children[this.data.index2]
    wx.setStorageSync('selectCity', selectCity)
    wx.navigateBack({delta: 1})
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-25
   * @detail   一级选中
   * @return   {[type]}     [description]
   */
  onClick3(e) {
    let params = e.currentTarget.dataset
    let result = this.data.cityList[this.data.index1].children[this.data.index2].children[params.index]
    this.setData({showMask: false})
    let storage = wx.getStorageSync('createPosition') || {}
    storage.type = result.labelId
    storage.typeName = result.name
    if(this.data.cityList[this.data.index1].labelId !== storage.parentType) storage.skills = []
    storage.parentType = this.data.cityList[this.data.index1].labelId
    wx.setStorageSync('createPosition', storage)
    wx.navigateBack({delta: 1})
  },
  tapHot (e) {
    let params = e.currentTarget.dataset
    let storage = {}
    storage.areaId = params.item.areaId
    storage.name = params.item.name
    wx.setStorageSync('selectCity', storage)
    wx.navigateBack({delta: 1})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-04
   * @detail   绑定用户输入
   * @return   {[type]}     [description]
   */
  bindInput(e) {
    let name = e.detail.value
    this.debounce(this.getLabelLIsts, null, 500, name)
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-11
   * @detail   防抖
   * @return   {[type]}   [description]
   */
  debounce(fn, context, delay, text) {
    clearTimeout(fn.timeoutId)
    fn.timeoutId = setTimeout(() => fn.call(context, text), delay)
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-16
   * @detail   搜索技能列表
   * @return   {[type]}   [description]
   */
  getLabelLIsts(name) {
    this.setData({showMask: false})
    if(!name) {
      this.setData({searing: false}, () => this.getLists())
      return;
    }
    getLabelLIstsApi({name}).then(res => {
      let cityList = res.data
      let regExp = new RegExp(name, 'g')
      cityList.map(field => {
        field.html = field.name.replace(regExp, `<span style="color: #652791;">${name}</span>`)
        field.html = `<div>${field.html}</div>`
      })
      this.setData({cityList, searing: true})
    })
  },
  closeMask(e) {
    this.setData({showMask: false, index1: 0, index2: 0})
    return
  }
})