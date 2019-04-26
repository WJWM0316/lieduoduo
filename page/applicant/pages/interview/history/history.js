import {
  getInterviewHistoryApi
} from '../../../../../api/pages/interview.js'

import {RECRUITER, APPLICANT, COMMON} from '../../../../../config.js'

let app = getApp()

Page({
  data: {
    hasReFresh: false,
    onBottomStatus: 0,
    tab: 'positionList',
    navH: app.globalData.navHeight,
    pageCount: 20,
    showDropDown: false,
    startTime: {
      date: '',
      active: false
    },
    endTime: {
      date: '',
      active: false
    },
    dateRange: {
      value: ''
    },
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
        active: true
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
  onTap() {
    this.setData({showDropDown: !this.data.showDropDown})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-26
   * @detail   时间范围搜索
   * @return   {[type]}     [description]
   */
  changeSearch(e) {
    let dateList = this.data.dateList
    let params = e.currentTarget.dataset
    dateList.map(field => field.active = field.id === params.id ? true : false)
    this.setData({dateList}, () => {
      let startTime = this.data.startTime
      let endTime = this.data.endTime
      startTime.date = ''
      startTime.active = false
      endTime.date = ''
      endTime.active = false
      this.setData({startTime, endTime})
    })
  },
  bindDateChange(e) {
    let field = e.currentTarget.dataset.type
    let value = this.data[field]
    value.date = e.detail.value
    value.active = true
    this.setData({[field]: value})
  },
  onShow() {
    let interviewList = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    }
    this.setData({interviewList}, () => this.getLists())
  },
  onPullDownRefresh() {
    let interviewList = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
    this.setData({interviewList, hasReFresh: true})
    return this.getLists(false).then(res => {
      let interviewList = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
      let onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
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
        let interviewList = this.data.interviewList
        let onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
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
    let interviewList = this.data.interviewList
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
    let params = e.currentTarget.dataset
    // 不知道什么情款  有时候拿不到数据
    if(!Object.keys(params).length) return
    wx.navigateTo({url: `${COMMON}arrangement/arrangement?id=${params.itemId}`})
  },
  formSubmit(e) {
    app.postFormId(e.detail.formId)
  }
})