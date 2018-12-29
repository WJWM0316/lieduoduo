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
  /**
   * @Author   小书包
   * @DateTime 2018-12-27
   * @detail   获取列表数据
   * @return   {[type]}   [description]
   */
  getTabLists() {
    getPositionListApi({status: this.data.positionStatus})
      .then(res => {
        this.setData({positionList: res.data})
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
    const status = e.currentTarget.dataset.status
    this.setData({positionStatus: status})
    this.getTabLists()
  }
})
