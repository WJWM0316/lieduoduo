
import {RECRUITER, APPLICANT, COMMON} from '../../../../../config.js'

import {getSelectorQuery}  from '../../../../../utils/util.js'

import { getPositionListApi } from '../../../../../api/pages/position.js'

const app = getApp()

Page({
  data: {
    pageCount: app.globalData.pageCount,
    hasReFresh: false,
    onBottomStatus: 0,
    positionList: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    },
  },
  onLoad() {
    this.getPositionList()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   获取职位列表
   * @return   {[type]}   [description]
   */
  getPositionList(hasLoading = true) {
    return new Promise((resolve, reject) => {
      const params = {count: this.data.pageCount, page: this.data.positionList.pageNum, hasLoading}
      getPositionListApi(params)
        .then(res => {
          const positionList = this.data.positionList
          const onBottomStatus = res.meta.nextPageUrl ? 0 : 2
          positionList.list = positionList.list.concat(res.data)
          positionList.isLastPage = res.meta.nextPageUrl ? false : true
          positionList.pageNum = positionList.pageNum + 1
          positionList.isRequire = true
          this.setData({positionList, onBottomStatus}, () => resolve(res))
        })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   下拉重新获取数据
   * @return   {[type]}              [description]
   */
  onPullDownRefresh(hasLoading = true) {
    const positionList = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
    this.setData({positionList, hasReFresh: true})
    this.getPositionList()
        .then(res => {
          const positionList = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
          const onBottomStatus = res.meta.nextPageUrl ? 0 : 2
          positionList.list = res.data
          positionList.isLastPage = res.meta.nextPageUrl ? false : true
          positionList.pageNum = 2
          positionList.isRequire = true
          this.setData({positionList, onBottomStatus, hasReFresh: false}, () => wx.stopPullDownRefresh())
        })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   触底加载数据
   * @return   {[type]}   [description]
   */
  onReachBottom() {
    const positionList = this.data.positionList
    if (!positionList.isLastPage) {
      this.getPositionList(false).then(() => this.setData({onBottomStatus: 1}))
    }
  }
})
