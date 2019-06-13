import {getAdvisorListApi} from '../../../../../api/pages/recruiter.js'
import {RECRUITER, COMMON, APPLICANT} from '../../../../../config.js'
import {getSelectorQuery}  from '../../../../../utils/util.js'

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasReFresh: false,
    navbarData: {
      title: '',
      background: 'transparent',
      color: '#ffffff'
    },
    navHeight: app.globalData.navHeight,
    cdnPath: app.globalData.cdnImagePath,
    tabFloat: false,
    tabIndex: 0,
    imgH: 164,
    tabList: [
      {
        title: '全部',
        value: -1,
        redHot: 0
      },
      {
        title: '未处理',
        value: 0,
        redHot: 1
      },
      {
        title: '已邀约',
        value: 1,
        redHot: 0
      },
      {
        title: '不感兴趣',
        value: 2,
        redHot: 0
      }
    ],
    listData: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      count: app.globalData.pageCount,
      onBottomStatus: 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.setStorageSync('choseType') !== 'RECRUITER') wx.setStorageSync('choseType', 'RECRUITER')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let listData = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      count: app.globalData.pageCount,
      onBottomStatus: 0
    }
    this.setData({listData})
    this.getList()
  },
  getList (hasLogin = true) {
    let listData = this.data.listData
    let params = {
      dealStatus: this.data.tabList[this.data.tabIndex].value,
      page: listData.pageNum,
      count: listData.count
    }
    return getAdvisorListApi(params, hasLogin).then(res => {
      listData.list = listData.list.concat(res.data)
      listData.pageNum++
      listData.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
      listData.onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
      this.setData({listData})
    })
  },
  toggle (e) {
    let index = e.currentTarget.dataset.index,
        tabList = this.data.tabList,
        listData = {
          list: [],
          pageNum: 1,
          isLastPage: false,
          count: app.globalData.pageCount,
          onBottomStatus: false
        }
    if (tabList[index].redHot) tabList[index].redHot = false
    this.setData({tabIndex: index, tabList, listData}, () => {
      this.getList()
    })
  },
  viewResumeDetail(e) {
    let uid = e.currentTarget.dataset.uid
    wx.navigateTo({url: `${COMMON}resumeDetail/resumeDetail?uid=${uid}`})
  },
  jump () {
    wx.navigateTo({url: `${RECRUITER}interview/index/index?tabIndex=1`})
  },
  imgLoad () {
    getSelectorQuery('.bg').then(res => {
      this.setData({imgH: res.height})
    })
  },
  onPageScroll(e) {
    let navbarData = this.data.navbarData
    if(e.scrollTop > 10) {
      if (navbarData.background !== '#ffffff') {
        navbarData.background = '#ffffff'
        navbarData.color = '#22292C'
        navbarData.title = '精选顾问'
        this.setData({navbarData})
      }
    } else {
      if (navbarData.background !== 'transparent') {
        navbarData.background = 'transparent'
        navbarData.title = ''
        navbarData.color = '#ffffff'
        this.setData({navbarData})
      }
    }
    if (e.scrollTop > this.data.imgH - this.data.navHeight) {
      if (!this.data.tabFloat) this.setData({tabFloat: true})
    } else {
      if (this.data.tabFloat) this.setData({tabFloat: false})
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let listData = {
          list: [],
          pageNum: 1,
          isLastPage: false,
          count: app.globalData.pageCount,
          onBottomStatus: false
        }
    this.setData({hasReFresh: true, listData})
    this.getList(false).then(res => {
      this.setData({hasReFresh: false})
      wx.stopPullDownRefresh()
    }).catch(() => {
      this.setData({hasReFresh: false})
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let listData = this.data.listData
    if (listData.isLastPage) return
    listData.onBottomStatus = 1
    this.setData({listData}, () => {
      this.getList(false)
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})