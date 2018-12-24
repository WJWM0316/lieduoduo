// page/applicant/pages/recruitmentActive/recruitmentActive.js
import { getBrowseMySelfApi, getMyBrowseUsersApi, getCollectMySelfApi } from '../../../../../api/pages/active'
let isBusy = false // 当前请求是否执行完毕
Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyList: [
      {
        id: 1,
        recruiterName: '文双',
        certification: false,
        recruiterPosition: '创始人、CEO',
        companyName: '老虎科技',
        positionNumber: 18,
        status: 1
      },
      {
        id: 2,
        recruiterName: '文双',
        certification: true,
        recruiterPosition: '创始人、CEO',
        companyName: '老虎科技',
        positionNumber: 18,
        status: 0
      },
      {
        id: 2,
        recruiterName: '文双',
        certification: true,
        recruiterPosition: '创始人、CEO',
        companyName: '老虎科技',
        positionNumber: 18,
        status: 0
      },
      {
        id: 2,
        recruiterName: '文双',
        certification: true,
        recruiterPosition: '创始人、CEO',
        companyName: '老虎科技',
        positionNumber: 18,
        status: 0
      },
      {
        id: 2,
        recruiterName: '文双',
        certification: true,
        recruiterPosition: '创始人、CEO',
        companyName: '老虎科技',
        positionNumber: 18,
        status: 0
      },
      {
        id: 2,
        recruiterName: '文双',
        certification: true,
        recruiterPosition: '创始人、CEO',
        companyName: '老虎科技',
        positionNumber: 18,
        status: 0
      },
      {
        id: 2,
        recruiterName: '文双',
        certification: true,
        recruiterPosition: '创始人、CEO',
        companyName: '老虎科技',
        positionNumber: 18,
        status: 0
      },
      {
        id: 2,
        recruiterName: '文双',
        certification: true,
        recruiterPosition: '创始人、CEO',
        companyName: '老虎科技',
        positionNumber: 18,
        status: 0
      }
    ],
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
    this.init()
  },
  /* 获取列表数据*/
  getList () {
    if (this.data.active === 'watched') {
      return getBrowseMySelfApi({page: this.data.page})
    } else {
      return getCollectMySelfApi({page: this.data.page})
    }
  },
  browseMySelf () {
    isBusy = true
    this.getList().then(res => {
      let newList = [...this.data.list, ...res.data]
      this.setData({
        list: newList,
        isLastPage: res.meta.currentPage === res.meta.lastPage
      })
      isBusy = false
      console.log(this.data.list, this.data.isLastPage, '111111111')
    })
  },
  /* 初始化 */
  init () {
    this.browseMySelf()
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
    if (this.data.isLastPage || isBusy) return
    this.data.page += 1
    this.init()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})