import { getPositionListApi } from '../../../../../api/pages/position.js'

import {RECRUITER} from '../../../../../config.js'

const app = getApp()

Page({
  data: {
    positionStatus: '1',
    defaultList: {
      total: 0,
      list: []
    },
    onLinePosition: {
      total: 0,
      list: []
    },
    offLinePosition: {
      total: 0,
      list: []
    },
    positionList: [],
    total: 0
  },
  onLoad() {
    getApp().globalData.identity = 'RECRUITER'
    this.getTabLists()
  },
  onReachBottom(e) {
    console.log(e)
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-27
   * @detail   获取列表数据
   * @return   {[type]}   [description]
   */
  getTabLists() {
    // 获取上线列表
    getPositionListApi({status: 1})
      .then(res => {
        const value = {total: res.meta.total, list: res.data}
        const key = this.data.positionStatus === '1' ? 'onLinePosition' : 'offLinePosition'
        this.setData({[key]: value, defaultList: value})
      })
    // 获取下线列表
    getPositionListApi({status: 0})
      .then(res => {
        const value = {total: res.meta.total, list: res.data}
        this.setData({offLinePosition: value})
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-25
   * @detail   detail
   * @return   {[type]}     [description]
   */
  routeJump(e) {
    const params = e.currentTarget.dataset
    switch(params.action) {
      case 'add':
        wx.navigateTo({url: `${RECRUITER}position/post/post`})
        break
      case 'edit':
        wx.navigateTo({url: `${RECRUITER}detail/position/position?positionId=${params.positionId}`})
        break
      default:
        break
    }
  },
  /* 子级tab栏切换 */
  onClickTab(e) {
    const positionStatus = e.currentTarget.dataset.status
    const key = positionStatus === '1' ? 'onLinePosition' : 'offLinePosition'
    this.setData({positionStatus, [key]: this.data[key]})
  }
})
