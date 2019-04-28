import {
  getNewHistoryApi
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
    timeModel: {
      show: false
    },
    positionModel: {
      show: false
    },
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
      isRequire: false,
      total: 0
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
  closeModal() {
    let timeModel = this.data.timeModel
    let positionModel = this.data.positionModel
    timeModel.show = false
    positionModel.show = false
    this.setData({timeModel, positionModel})
  },
  onTapTime(e) {
    let positionModel = this.data.positionModel
    let timeModel = this.data.timeModel
    timeModel.show = !timeModel.show
    if(timeModel.show) positionModel.show = false
    this.setData({positionModel, timeModel})
  },
  onTapPosition(e) {
    let positionModel = this.data.positionModel
    let timeModel = this.data.timeModel
    positionModel.show = !positionModel.show
    if(positionModel.show) timeModel.show = false
    this.setData({positionModel, timeModel})
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
    let interviewList = this.data.interviewList
    dateList.map(field => field.active = field.id === params.id ? true : false)
    this.setData({dateList}, () => {
      let startTime = this.data.startTime
      let endTime = this.data.endTime
      startTime.date = ''
      startTime.active = false
      endTime.date = ''
      endTime.active = false
      interviewList.pageNum = 1
      interviewList.list = []
      this.setData({startTime, endTime, interviewList}, () => this.getLists())
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-27
   * @detail   自定义的开始时间改变
   */
  bindStartDateChange(e) {
    let date = e.detail.value
    let startTime = this.data.startTime
    let endTime = this.data.endTime
    let interviewList = this.data.interviewList

    // 时间间隔不能超过20天
    let limitTime = 30 * 24 * 60 * 60 * 1000
    startTime.date = date
    startTime.active = true

    // 当前操作时选择开始时间
    // 要判断跟结束时间的间隔
    if(endTime.active && this.timeStampToDay(startTime, endTime)) {
      return
    }

    this.setData({ startTime }, () => {
      let endTime = this.data.endTime
      let dateList = this.data.dateList
      if(startTime.active && endTime.active) {
        dateList.map(field => field.active = false)
        interviewList.pageNum = 1
        interviewList.list = []
        this.setData({ dateList, interviewList }, () => this.getLists())
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-27
   * @detail   时间戳转化成天数
   */
  timeStampToDay(startTime, endTime) {
    let start = new Date(startTime.date).getTime()
    let end = new Date(endTime.date).getTime()
    let timeStamp = end - start
    let day = Math.floor(timeStamp / 86400000)
    console.log(day)
    return day > 30
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-27
   * @detail   自定义的结束时间改变
   */
  bindEndDateChange(e) {

    let date = e.detail.value
    let startTime = this.data.startTime
    let endTime = this.data.endTime
    let interviewList = this.data.interviewList

    // 时间间隔不能超过20天
    let limitTime = 30 * 24 * 60 * 60 * 1000
    endTime.date = e.detail.value
    endTime.active = true

    // 当前操作时选择开始时间
    // 要判断跟结束时间的间隔
    if(startTime.active && this.timeStampToDay(startTime, endTime)) {
      app.wxToast({title: '时间范围不能超过30天'})
      return
    }

    this.setData({ endTime }, () => {
      let endTime = this.data.endTime
      let dateList = this.data.dateList
      if(startTime.active && endTime.active) {
        dateList.map(field => field.active = false)
        interviewList.pageNum = 1
        interviewList.list = []
        this.setData({dateList, interviewList}, () => this.getLists())
      }
    })
  },
  onShow() {
    let interviewList = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      total: 0
    }
    this.setData({interviewList}, () => this.getLists())
  },
  onPullDownRefresh() {
    let interviewList = {list: [], pageNum: 1, isLastPage: false, isRequire: false, total: 0}
    this.setData({interviewList, hasReFresh: true})
    return this.getLists(false).then(res => {
      let interviewList = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
      let onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
      interviewList.list = res.data
      interviewList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
      interviewList.pageNum = 2
      interviewList.isRequire = true
      interviewList.total = res.meta.total
      this.setData({interviewList, onBottomStatus, hasReFresh: false}, () => wx.stopPullDownRefresh())
    })
  },
  getLists(hasLoading = true) {

    return new Promise((resolve, reject) => {
      let params = {}
      let startTime = this.data.startTime
      let endTime = this.data.endTime
      let dateList = this.data.dateList
      let activeItem = dateList.find(field => field.active)
      let start = ''
      let end = ''

      params = {count: this.data.pageCount, page: this.data.interviewList.pageNum, ...app.getSource()}

      // 选择时间范围
      if(activeItem && activeItem.active) {
        // 默认拿全部
        params = parseInt(activeItem.id) === 1 ? params : Object.assign(params, {gap: activeItem.id})
      }

      // 自定义时间范围
      if(startTime.active && endTime.active) {
        start = new Date(startTime.date).getTime() / 1000
        end = new Date(endTime.date).getTime() / 1000
        params = Object.assign(params, {start, end})
      }

      getNewHistoryApi(params, hasLoading).then(res => {
        let interviewList = this.data.interviewList
        let onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        interviewList.list = interviewList.list.concat(res.data)
        interviewList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        interviewList.pageNum = interviewList.pageNum + 1
        interviewList.isRequire = true
        interviewList.total = res.meta.total
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