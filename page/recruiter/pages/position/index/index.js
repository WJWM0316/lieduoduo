import { getPositionListApi } from '../../../../../api/pages/position.js'

import {RECRUITER, COMMON} from '../../../../../config.js'

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
    }
  },
  onShow() {
    this.getTabLists()
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-27
   * @detail   获取列表数据
   * @return   {[type]}   [description]
   */
  getTabLists() {

    // 获取上线列表
    const getOnlineLists = new Promise((resolve, reject) => {
      getPositionListApi({status: 1,recruiter: app.globalData.recruiterDetails.uid})
        .then(res => {
          this.setData({onLinePosition: {list: res.data, total: res.meta.total}})
          resolve()
        })
        .catch(err => {
          reject(err)
        })
    })

    // 获取下线列表
    const getOffLineLists = new Promise((resolve, reject) => {
      getPositionListApi({status: 0,recruiter: app.globalData.recruiterDetails.uid})
        .then(res => {
          this.setData({offLinePosition: {list: res.data, total: res.meta.total}})
          resolve()
        })
        .catch(err => {
          reject(err)
        })
    })

    Promise
      .all([getOnlineLists, getOffLineLists])
      .then(res => {
        const key = this.data.positionStatus === '1' ? 'onLinePosition' : 'offLinePosition'
        this.setData({defaultList: this.data[key]})
      })
      .catch(err => {
        app.wxToast({title: err})
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
      case 'detail':
        wx.navigateTo({url: `${COMMON}positionDetail/positionDetail?positionId=${params.positionId}&companyId=${params.companyId}`})
        break
      default:
        break
    }
  },
  /* 子级tab栏切换 */
  onClickTab(e) {
    const positionStatus = e.currentTarget.dataset.status
    const key = positionStatus === '1' ? 'onLinePosition' : 'offLinePosition'
    const value = this.data[key]
    this.setData({positionStatus, [key]: value, defaultList: value})
  }
})
