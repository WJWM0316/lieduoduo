import { getPositionListApi, getPositionListNumApi } from '../../../../../api/pages/position.js'
import {RECRUITER, COMMON} from '../../../../../config.js'

const app = getApp()

Page({
  data: {
    navH: 0,
    positionStatus: '1',
    onLinePositionNum: 0,
    offLinePositionNum: 0,
    onBottomStatus: 0,
    offBottomStatus: 0,
    onLinePosition: {
      list: [],
      pageNum: 1,
      count: 5,
      isLastPage: false,
      isRequire: false
    },
    offLinePosition: {
      list: [],
      pageNum: 1,
      count: 5,
      isLastPage: false,
      isRequire: false
    }
  },
  onLoad() {
    this.setData({navH: app.globalData.navHeight})
  },
  onShow() {
    getPositionListNumApi({recruiter: app.globalData.recruiterDetails.uid}).then(res => {
      this.setData({onLinePositionNum: res.data.open, offLinePositionNum: res.data.close})
    })
    this.getOnlineLists()
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-27
   * @detail   获取列表数据
   * @return   {[type]}   [description]
   */
  getOnlineLists(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let uid = app.globalData.recruiterDetails.uid
      let onLinePosition = this.data.onLinePosition
      let onBottomStatus = this.data.onBottomStatus
      getPositionListApi({status: 1, recruiter: uid, count: onLinePosition.count, page: onLinePosition.pageNum, hasLoading})
        .then(res => {
          onLinePosition.list = onLinePosition.list.concat(res.data || [])
          onLinePosition.pageNum++
          onLinePosition.isRequire = true
          if (!res.meta.nextPageUrl) {
            onLinePosition.isLastPage = true
            onBottomStatus = 2
          } else {
            onBottomStatus = 0
          }
          resolve(res)
          this.setData({onLinePosition, onBottomStatus})
        })
    })
  },
  getOffLineLists(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let uid = app.globalData.recruiterDetails.uid
      let offLinePosition = this.data.offLinePosition
      let offBottomStatus = this.data.offBottomStatus
      getPositionListApi({status: 0, recruiter: uid, count: offLinePosition.count, page: offLinePosition.pageNum, hasLoading})
        .then(res => {
          offLinePosition.list = offLinePosition.list.concat(res.data || [])
          offLinePosition.pageNum++
          offLinePosition.isRequire = true
          if (!res.meta.nextPageUrl) {
            offLinePosition.isLastPage = true
            offBottomStatus = 2
          } else {
            offBottomStatus = 0
          }
          this.setData({offLinePosition, offBottomStatus})
          resolve()
        })
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
    if (positionStatus === '0') {
      if (!this.data.offLinePosition.isRequire) {
        this.getOffLineLists()
      }
    }
    this.setData({positionStatus})
  },

  onReachBottom(e) {
    if (this.data.positionStatus === '1') {
      let onLinePosition = this.data.onLinePosition
      if (!onLinePosition.isLastPage) {
        this.setData({onBottomStatus: 1})
        this.getOnlineLists(false)
      }
    } else {
      let offLinePosition = this.data.offLinePosition
      if (!offLinePosition.isLastPage) {
        this.setData({offBottomStatus: 1})
        this.getOffLineLists(false)
      }
    }
  },

  onPullDownRefresh(e) {
    if (this.data.positionStatus === '1') {
      let onLinePosition = {
        list: [],
        pageNum: 1,
        count: 5,
        isLastPage: false,
        isRequire: false
      }
      this.setData({onLinePosition, onBottomStatus: 0})
      this.getOnlineLists(false).then(res => {
        wx.stopPullDownRefresh()
      })
    } else {
      let onLinePosition = {
        list: [],
        pageNum: 1,
        count: 5,
        isLastPage: false,
        isRequire: false
      }
      this.setData({offLinePosition, offBottomStatus})
      this.getOffLineLists(false)
    }
  }
})
