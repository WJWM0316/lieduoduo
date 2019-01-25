import {
  getLabelPositionApi,
  getLabelLIstsApi
} from '../../../../api/pages/label.js'

import {RECRUITER} from '../../../../config.js'

const app = getApp()

Page({
  data: {
    positionTypeList: [],
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
    const options = this.data.query
    getLabelPositionApi()
      .then(res => {
        const positionTypeList = res.data
        this.setData({positionTypeList: res.data, query: options})
      })
  },
  onClick(e) {
    const params = e.currentTarget.dataset
    const storage = wx.getStorageSync('createPosition') || {}
    storage.type = params.labelId
    storage.typeName = params.name
    storage.parentType = params.topPid
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
    // const storage = wx.getStorageSync('createPosition') || {}
    const params = e.currentTarget.dataset
    const positionTypeList = this.data.positionTypeList
    // let showMask = false
    // let result = {}
    positionTypeList.map((field, index) => field.active = index === params.index ? true : false)
    // if(positionTypeList[params.index].children.length) {
    //   showMask = true
    // } else {
    //   result = positionTypeList[params.index]
    //   showMask = false
    //   storage.type = result.labelId
    //   storage.typeName = result.name
    //   storage.parentType = result.labelId
    //   wx.setStorageSync('createPosition', storage)
    //   wx.navigateBack({delta: 1})
    // }
    positionTypeList[params.index].children.map((field, index) => field.active = index === this.data.index1 ? true : false)
    positionTypeList[params.index].children[this.data.index1].children[this.data.index2].active = true
    this.setData({index1: params.index, positionTypeList, showMask: true})
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-25
   * @detail   一级选中
   * @return   {[type]}     [description]
   */
  onClick2(e) {
    const params = e.currentTarget.dataset
    const positionTypeList = this.data.positionTypeList
    positionTypeList[this.data.index1].children.map((field, index) => field.active = index === params.index ? true : false)
    this.setData({index2: params.index, positionTypeList, showMask: true})
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-25
   * @detail   一级选中
   * @return   {[type]}     [description]
   */
  onClick3(e) {
    const params = e.currentTarget.dataset
    const result = this.data.positionTypeList[this.data.index1].children[this.data.index2].children[params.index]
    this.setData({showMask: false})
    const storage = wx.getStorageSync('createPosition') || {}
    storage.type = result.labelId
    storage.typeName = result.name
    storage.parentType = this.data.positionTypeList[this.data.index1].labelId
    wx.setStorageSync('createPosition', storage)
    wx.navigateBack({delta: 1})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-04
   * @detail   绑定用户输入
   * @return   {[type]}     [description]
   */
  bindInput(e) {
    const name = e.detail.value
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
    getLabelLIstsApi({name})
      .then(res => {
        const positionTypeList = res.data
        const regExp = new RegExp(name, 'g')
        positionTypeList.map(field => {
          field.html = field.name.replace(regExp, `<span style="color: #652791;">${name}</span>`)
          field.html = `<div>${field.html}</div>`
        })
        this.setData({positionTypeList, searing: true})
      })
  },
  closeMask(e) {
    this.setData({showMask: false, index1: 0, index2: 0})
    return
  }
})