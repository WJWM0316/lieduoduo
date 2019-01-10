// page/applicant/pages/recruitmentActive/recruitmentActive.js
import { getBrowseMySelfApi, getMyBrowseUsersApi, getCollectMySelfApi } from '../../../../../api/pages/active'
let isBusy = false // 当前请求是否执行完毕
Page({

  /**
   * 页面的初始数据
   */
  data: {
    watchedList: [],
    interestList: [],
    active: 'watched',
    page: 1, // 当前页数
    list: [], // 当前查看的列表
    isLastPage: false // 是否最后一页
  },
  toggle (e) {
    this.setData({
      active: e.currentTarget.dataset.active,
      page: 1,
      list: [],
      isLastPage: false
    })
    this.getList()
  },
  /* 获取列表数据*/
  getList () {
    if (this.data.active === 'watched') {
//    if (this.data.watchedList.length > 0) return
      getBrowseMySelfApi({page: this.data.page}).then(res => {
        if (res.data.length <= 0) return
        this.setData({
          watchedList: res.data,
          list: res.data
        })
      })
    } else {
      getCollectMySelfApi({page: this.data.page}).then(res => {
        if (res.data.length <= 0) return
        this.setData({
          interestList: res.data,
          list: res.data
        })
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
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