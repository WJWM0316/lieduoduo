import { getPositionListApi, getPositionListNumApi } from '../../../../../api/pages/position.js'

import {RECRUITER, COMMON} from '../../../../../config.js'

import {
  getCompanyIdentityInfosApi
} from '../../../../../api/pages/company.js'

const app = getApp()

Page({
  data: {
    navH: app.globalData.navHeight,
    positionStatus: '1',
    onLinePositionNum: 0,
    offLinePositionNum: 0,
    onBottomStatus: 0,
    offBottomStatus: 0,
    onLinePosition: {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false
    },
    offLinePosition: {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false
    },
    hasReFresh: false,
    identityInfos: {}
  },
  onLoad() {
    if(app.globalData.recruiterDetails.identityAuth !== 1) this.getCompanyIdentityInfos()
  },
  onShow() {
    let onLinePosition = {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false
    }
    let offLinePosition = {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false
    }
    getPositionListNumApi({recruiter: app.globalData.recruiterDetails.uid}).then(res => {
      this.setData({onLinePosition, offLinePosition, onLinePositionNum: res.data.online, offLinePositionNum: res.data.offline})
      this.getLists()
    })
  },
  formSubmit(e) {
    app.postFormId(e.detail.formId)
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-29
   * @detail   获取个人身份信息
   * @return   {[type]}   [description]
   */
  getCompanyIdentityInfos() {
    getCompanyIdentityInfosApi().then(res => {
      this.setData({identityInfos: res.data})
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-29
   * @detail   发布职位
   * @return   {[type]}   [description]
   */
  publicPosition() {
    const identityInfos = this.data.identityInfos
    if(Object.keys(identityInfos).length) {
      if(identityInfos.status !== 1) {
        app.wxConfirm({
          title: '您的身份尚未认证成功',
          content: `请先认证`,
          confirmText: '知道了',
          confirmBack: () => {
            wx.navigateTo({url: `${RECRUITER}user/company/identity/identity?type=create&realName=${identityInfos.companyInfo.realName}&action=edit`})
          }
        })
      }
    } else {
      wx.navigateTo({url: `${RECRUITER}position/post/post`})
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-24
   * @detail   获取列表数据
   * @return   {[type]}   [description]
   */
  getLists() {
    switch(this.data.positionStatus) {
      case '1':
        return this.getOnlineLists()
        break;
      case '2':
        return this.getOffLineLists()
        break;
      default:
        break;
    }
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
      getPositionListApi({is_online: 1, recruiter: uid, count: onLinePosition.count, page: onLinePosition.pageNum, hasLoading})
        .then(res => {
          onLinePosition.list = onLinePosition.list.concat(res.data || [])
          onLinePosition.pageNum++
          onLinePosition.isRequire = true
          if (!res.meta || !res.meta.nextPageUrl) {
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
      getPositionListApi({is_online: 2, recruiter: uid, count: offLinePosition.count, page: offLinePosition.pageNum, hasLoading})
        .then(res => {
          offLinePosition.list = offLinePosition.list.concat(res.data || [])
          offLinePosition.pageNum++
          offLinePosition.isRequire = true
          if (!res.meta || !res.meta.nextPageUrl) {
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
        this.publicPosition()
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
    if (positionStatus === '2') {
      if (!this.data.offLinePosition.isRequire) {
        this.getOffLineLists()
      }
    } else {
      if (!this.data.onLinePosition.isRequire) {
        this.getOnlineLists()
      }
    }
    this.setData({positionStatus})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   detail
   * @return   {[type]}     [description]
   */
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
        count: 20,
        isLastPage: false,
        isRequire: false
      }
      this.setData({onLinePosition, onBottomStatus: 0, hasReFresh: true})
      this.getOnlineLists(false).then(res => {
        wx.stopPullDownRefresh()
        this.setData({hasReFresh: false})
      })
    } else {
      let offLinePosition = {
        list: [],
        pageNum: 1,
        count: 20,
        isLastPage: false,
        isRequire: false
      }
      this.setData({offLinePosition, offBottomStatus: 0, hasReFresh: true})
      this.getOffLineLists(false).then(res => {
        wx.stopPullDownRefresh()
        this.setData({hasReFresh: false})
      })
    }
  },
  onShareAppMessage(options) {
    let that = this
　　return app.wxShare({options})
  }
})
