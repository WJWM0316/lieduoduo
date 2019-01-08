import { getLabelPositionApi } from '../../../../../api/pages/label.js'

import {RECRUITER} from '../../../../../config.js'

Page({
  data: {
    positionTypeList: [],
    query: '',
    statusBarHeight: 0,
    index1: 0,
    index2: 0,
    showMask: false
  },
  onLoad(options) {
    wx.getSystemInfo({
      success: res => {
        this.setData({statusBarHeight: res.statusBarHeight + 46})
      }
    })
    getLabelPositionApi()
      .then(res => {
        const positionTypeList = res.data
        this.setData({positionTypeList: res.data, query: options})
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-25
   * @detail   一级选中
   * @return   {[type]}     [description]
   */
  onClick1(e) {
    const params = e.currentTarget.dataset
    const positionTypeList = this.data.positionTypeList
    positionTypeList.map((field, index) => field.active = index === params.index ? true : false)
    this.setData({index1: params.index, positionTypeList, showMask: true})
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-25
   * @detail   一级选中
   * @return   {[type]}     [description]
   */
  onClick2(e) {
    this.setData({showMask: true})
    const params = e.currentTarget.dataset
    const positionTypeList = this.data.positionTypeList
    positionTypeList[this.data.index1].children.map((field, index) => field.active = index === params.index ? true : false)
    console.log(positionTypeList)
    this.setData({index2: params.index, positionTypeList})
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
    const storage = wx.getStorageSync('createPosition')
    const url = this.data.query.positionId ? `${RECRUITER}position/post/post?positionId=${this.data.query.positionId}` : `${RECRUITER}position/post/post`
    storage.type = result.labelId
    storage.typeName = result.name
    storage.parentType = this.data.positionTypeList[this.data.index1].labelId
    wx.setStorageSync('createPosition', storage)
    wx.redirectTo({ url })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-04
   * @detail   绑定用户输入
   * @return   {[type]}     [description]
   */
  bindInput(e) {
    console.log(e.detail.value)
  },
  closeMask() {
    this.setData({showMask: false})
    return
  }
})