// page/applicant/pages/recruitmentActive/recruitmentActive.js
import { getBrowseMySelfApi, getMyBrowseUsersApi, getCollectMySelfApi } from '../../../../../api/pages/active'
let isBusy = false // 当前请求是否执行完毕
Page({

  /**
   * 页面的初始数据
   */
  data: {
    interestStatus: 0,
    watchedStatus: 0,
    watchedList: {
      list: [],
      pageNum: 1,
      count: 5,
      isLastPage: false,
      isRequire: false
    },
    interestList: {
      list: [],
      pageNum: 1,
      count: 5,
      isLastPage: false,
      isRequire: false
    },
    active: 'watched'
  },
  toggle (e) {
    let active = e.currentTarget.dataset.active
    if (active === 'watched') {
      if (!this.data.watchedList.list.length && !this.data.watchedList.isLastPage) {
        this.getWatchedList()
        this.setData({active})
      } else {
        this.setData({active})
      }
    } else {
      if (!this.data.interestList.list.length && !this.data.interestList.isLastPage) {
        this.getInterestList()
        this.setData({active})
      } else {
        this.setData({active})
      }
    }
  },
  /* 获取对我感兴趣的列表数据*/
 getInterestList (hasLoading = true) {
  return new Promise((resolve, reject) => {
    let interestList = this.data.interestList
    let interestStatus = this.data.interestStatus
    getCollectMySelfApi({page: this.data.interestList.pageNum, count: this.data.interestList.count, hasLoading})
    .then(res => {
      interestList.list = interestList.list.concat(res.data || [])
      interestList.list.pageNum++
      interestList.list.isRequire = true
      if (!res.meta.nextPageUrl) {
        interestList.isLastPage = true
        interestStatus = 2
      } else {
        interestStatus = 0
      }
      resolve(res)
      this.setData({interestList, interestStatus})
    })
  })
 },
 /* 获取看过我的列表数据*/
 getWatchedList (hasLoading = true) {
  return new Promise((resolve, reject) => {
    let watchedList = this.data.watchedList
    let watchedStatus = this.data.watchedStatus
    getBrowseMySelfApi({page: this.data.watchedList.pageNum, count: this.data.watchedList.count, hasLoading})
    .then(res => {
      watchedList.list = watchedList.list.concat(res.data || [])
      watchedList.list.pageNum++
      watchedList.list.isRequire = true
      if (!res.meta.nextPageUrl) {
        watchedList.isLastPage = true
        watchedStatus = 2
      } else {
        watchedStatus = 0
      }
      resolve(res)
      this.setData({watchedList, watchedStatus})
    })
  })
 },
 init () {
   this.getWatchedList(true)
 },
  /* 下拉刷新 */
  onPullDownRefresh(e) {
    if (this.data.active === 'watched') {
      let watchedList = {
        list: [],
        pageNum: 1,
        count: 5,
        isLastPage: false,
        isRequire: false
      }
      this.setData({watchedList, onBottomStatus: 0})
      this.getWatchedList(false).then(res => {
        wx.stopPullDownRefresh()
      })
    } else {
      let interestList = {
        list: [],
        pageNum: 1,
        count: 5,
        isLastPage: false,
        isRequire: false
      }
      this.setData({interestList, onBottomStatus: 0})
      this.getInterestList(false).then(res => {
        wx.stopPullDownRefresh()
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})