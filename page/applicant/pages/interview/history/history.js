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
    showDropDown: false,
    interviewList: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    },
    dateList: [
      {
        id: 1,
        text: '全部',
        active: false
      },
      {
        id: 7,
        text: '近7天',
        active: false
      },
      {
        id: 15,
        text: '近15天',
        active: false
      },
      {
        id: 30,
        text: '近30天',
        active: false
      }
    ]
  },
  onLoad() {
    wx.setStorageSync('choseType', 'APPLICANT')
  },
  onTap() {
    console.log(11111111)
    this.setData({showDropDown: !this.data.showDropDown})
  },
  onShow() {
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
      let params = {count: this.data.pageCount, page: this.data.interviewList.pageNum, ...app.getSource()}
      getInterviewHistoryApi(params, hasLoading).then(res => {
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
    wx.navigateTo({url: `${COMMON}arrangement/arrangement?id=${params.itemId}`})
  },
  formSubmit(e) {
    app.postFormId(e.detail.formId)
  }
})