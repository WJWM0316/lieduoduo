import { getLabelPositionApi, getAreaListApi, getFieldListApi, getPositionTypeApi } from '../../../../../../api/pages/label.js'

import {RECRUITER} from '../../../../../../config.js'

Page({
  data: {
    positionTypeList: [],
    query: '',
    statusBarHeight: 0,
    index1: 0,
    index2: 0,
    showMask: false,
    title: '',
    haveThirdList: false
  },
  onLoad(options) {
    wx.getSystemInfo({
      success: res => {
        this.setData({statusBarHeight: res.statusBarHeight + 46})
      }
    })
      this.getLableList(options.target).then(res => {
        const positionTypeList = res.data
        this.setData({positionTypeList: res.data, query: options, title: options.title})
      })
  },
  // 请求标签(0:城市标签，1:职位标签，2:领域标签，3:职位类别)
  getLableList (target) {
    switch (target) {
      case '0':
        return getAreaListApi()
        break;
      case '1':
        return getLabelPositionApi()
        break;
      case '2':
        return getFieldListApi()
        break;
      case '3':
        return getPositionTypeApi()
        break;
    }
  },
  /**
   * @detail   一级选中
   */
  onClick1(e) {
    const params = e.currentTarget.dataset
    const positionTypeList = this.data.positionTypeList
    positionTypeList.map((field, index) => field.active = index === params.index ? true : false)
    const nowResult = positionTypeList[params.index]
    if (positionTypeList[this.data.index1].children.length) {
      this.setData({index1: params.index, positionTypeList, showMask: true})
    } else {
      wx.setStorageSync('result', nowResult)
      wx.navigateBack({delta: 1}) 
    }
  },
  /**
   * @detail   二级选中
   */
  onClick2(e) {
    this.setData({showMask: true})
    const params = e.currentTarget.dataset
    const positionTypeList = this.data.positionTypeList
    let nowResult = positionTypeList[this.data.index1].children[params.index]
    positionTypeList[this.data.index1].children.map((field, index) => field.active = index === params.index ? true : false)
    if (positionTypeList[this.data.index1].children[params.index].children.length) {
      this.setData({index2: params.index, positionTypeList, showMask: true})
    } else {
      wx.setStorageSync('result', nowResult)
      wx.navigateBack({delta: 1})
    }
  },
  /**
   * @detail   三级选中
   */
  onClick3(e) {
    const params = e.currentTarget.dataset
    const result = this.data.positionTypeList[this.data.index1].children[this.data.index2].children[params.index]
    this.setData({showMask: false})
    wx.setStorageSync('result', result)
    wx.navigateBack({delta: 1})
  },
  /**
   * @detail   绑定用户输入
   */
  bindInput(e) {
    console.log(e.detail.value)
  },
  closeMask() {
//  this.setData({showMask: false})
    return
  }
})