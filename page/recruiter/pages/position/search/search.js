import {
  getPositionNameListApi
} from '../../../../../api/pages/position.js'

import {RECRUITER} from '../../../../../config.js'

let app = getApp()

Page({
  data: {
    keyword: '',
    nameLists: [],
    canClick: false
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
  onLoad() {
    let storage = wx.getStorageSync('createPosition')
    if(storage) {
      this.setData({keyword: storage.position_name, canClick: true})
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-25
   * @detail   绑定用户输入
   * @return   {[type]}     [description]
   */
  bindInput(e) {
    let name = e.detail.value
    if(name && name !== '.') {
      this.debounce(this.getPositionNameList, null, 500, name)
    } else {
      this.setData({nameLists: []})
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-10
   * @detail   获取职位名称列表
   * @return   {[type]}   [description]
   */
  getPositionNameList(name) {
    this.setData({keyword: name})
    this.bindButtonStatus()
    getPositionNameListApi({name}).then(res => {
      let nameLists = res.data
      nameLists.map(field => field.html = '<div>' + field.name.replace(new RegExp(name,'g'), `<span style="color: #652791;">${name}</span>`) + '</div>')
      this.setData({nameLists})
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-10
   * @detail   绑定按钮状态
   * @return   {[type]}   [description]
   */
  bindButtonStatus() {
    let canClick = this.data.keyword ? true : false
    this.setData({canClick})
  },
  onClick(e) {
    let name = e.currentTarget.dataset.name
    let storage = wx.getStorageSync('createPosition')
    storage.position_name = name
    wx.setStorageSync('createPosition', storage)
    this.setData({keyword: name, nameLists: []})
  },
  submit(e) {
    let storage = wx.getStorageSync('createPosition')
    storage.position_name = this.data.keyword
    wx.setStorageSync('createPosition', storage)
    wx.navigateBack({
      delta: 1
    })
  }
})