import {
  getInterviewHistoryApi
} from '../../../../../api/pages/interview.js'

import {RECRUITER, APPLICANT, COMMON} from '../../../../../config.js'

const app = getApp()

Page({
  data: {
    hasReFresh: false,
    onBottomStatus: 0,
    tab: 'positionList',
    navH: app.globalData.navHeight,
    pageCount: 20,
    interviewList: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    }
  },
  onShow(options) {
    const interviewList = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    }
    this.setData({interviewList}, () => this.getLists())
  },
  onPullDownRefresh() {
    const interviewList = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
    this.setData({interviewList, hasReFresh: true})
    return this.getLists(false).then(res => {
      const interviewList = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
      const onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
      interviewList.list = res.data
      interviewList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
      interviewList.pageNum = 2
      interviewList.isRequire = true
      this.setData({interviewList, onBottomStatus, hasReFresh: false}, () => wx.stopPullDownRefresh())
    })
  },
  getLists(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let params = {count: this.data.pageCount, page: this.data.interviewList.pageNum, hasLoading}
      getInterviewHistoryApi(params).then(res => {
        const interviewList = this.data.interviewList
        const onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        interviewList.list = interviewList.list.concat(res.data)
        interviewList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        interviewList.pageNum = interviewList.pageNum + 1
        interviewList.isRequire = true
        this.setData({interviewList, onBottomStatus}, () => resolve(res))
      })
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    const interviewList = this.data.interviewList
    if (!interviewList.isLastPage) {
      this.getLists(false).then(() => this.setData({onBottomStatus: 1}))
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-03-01
   * @detail   detail
   */
  routeJump(e) {
    const params = e.currentTarget.dataset
    // 不知道什么情款  有时候拿不到数据
    if(!Object.keys(params).length) return
    switch(params.status) {
      case 51:
        if(Number(params.positionid)) {
          wx.navigateTo({url: `${COMMON}arrangement/arrangement?id=${params.itemId}`})
          // wx.navigateTo({url: `${COMMON}positionDetail/positionDetail?positionId=${params.positionid}`})
        } else {
          wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${params.recruiteruid}`})
        }
        break
      case 12:
        if(Number(params.positionid)) {
          wx.navigateTo({url: `${COMMON}positionDetail/positionDetail?positionId=${params.positionid}`})
        } else {
          wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${params.recruiteruid}`})
        }
        break
      case 11:
        if(Number(params.positionid)) {
          wx.navigateTo({url: `${COMMON}positionDetail/positionDetail?positionId=${params.positionid}`})
        } else {
          wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${params.recruiteruid}`})
        }
        break
      case 21:
        if(Number(params.positionid)) {
          wx.navigateTo({url: `${COMMON}positionDetail/positionDetail?positionId=${params.positionid}`})
        } else {
          wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${params.recruiteruid}`})
        }
        break
      case 54:
        if(Number(params.positionid)) {
          wx.navigateTo({url: `${COMMON}positionDetail/positionDetail?positionId=${params.positionid}`})
        } else {
          wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${params.recruiteruid}`})
        }
        break
      default:
        wx.navigateTo({url: `${COMMON}arrangement/arrangement?id=${params.itemId}`})
        break
    }
  },
  formSubmit(e) {
    app.postFormId(e.detail.formId)
  }
})