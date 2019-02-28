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
    pageCount: 8,
    interviewList: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow(options) {
    this.getLists()
  },
  onPullDownRefresh() {

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

  }
})