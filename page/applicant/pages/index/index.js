//index.js
//获取应用实例
import {RECRUITER, APPLICANT, COMMON} from '../../../../config.js'
import {getSelectorQuery}  from '../../../../utils/util.js'
import {getUserInfoApi} from '../../../../api/pages/user.js'
import { geMyBrowseUsersApi, getAvartListApi } from '../../../../api/pages/active.js'
import { getMyCollectUsersApi } from '../../../../api/pages/browse.js'
const app = getApp()
Page({
  data: {
    // 页面的默认数据列表
    pageList: 'mySeen',
    cdnImagePath: app.globalData.cdnImagePath,
    choseType: wx.getStorageSync('choseType') || null,
    needLogin: false,
    companyList: [],
    lookedList: [], // 我看过的列表
    collectList: [], // 我感兴趣的列表
    defaultList: [],
    moreList: [],
    activeList: [],
    redDotActiveList: false // 招聘官动态红点
  },
  onLoad: function () {
    let choseType = wx.getStorageSync('choseType')
    if (!choseType) {
      wx.hideTabBar()
    } else {
      wx.showTabBar()
    }
    if (choseType === 'RECRUITER') {
      app.wxConfirm({
        title: '提示',
        content: '检测到你是招聘官，是否切换招聘端',
        confirmBack() {
          app.globalData.identity = 'RECRUITER'
          wx.reLaunch({
            url: `${RECRUITER}index/index`
          })
        },
        cancelBack() {
          app.globalData.identity = 'APPLICANT'
          wx.setStorageSync('choseType', 'APPLICANT')
          app.getAllInfo()
        }
      })
    }
  },
  onShow() {
    if (app.globalData.resumeInfo.uid) {
      this.init()
    } else {
      app.pageInit = () => {
        this.init()
      }
    }
    wx.setTabBarBadge({
      index: 2,
      text: '99+'
    })
  },
  getMyBrowseList () {
    return geMyBrowseUsersApi()
  },
  getMyCollectList () {
    return getMyCollectUsersApi()
  },
  /* 获取招聘官动态列表 */
  getAvartLis () {
    return getAvartListApi()
  },
  init () {
    if (this.data.pageList === 'mySeen') {
      this.getMyBrowseList().then(res => {
        this.setData({
          lookedList: res.data,
          defaultList: res.data
        })
      })
    }else {
      this.getMyCollectList().then(res => {
        this.setData({
          collectList: res.data,
          defaultList: res.data
        })
      })
    }
    this.getAvartLis().then(res => {
      this.setData({
        moreList: res.data.moreRecruiter,
        activeList: res.data.recruiterDynamic,
        redDotActiveList: res.data.redDotJobHunterCollectList && res.data.redDotJobHunterViewList
      })
    })
  },
  toggle(e) {
    let pageList = e.currentTarget.dataset.pageList
    const key = pageList === 'mySeen'? 'lookedList' : 'collectList'
    if (this.data[key].length === 0) {
      if (pageList === 'mySeen') {
        this.getMyBrowseList().then(res => {
          this.setData({
            pageList,
            lookedList: res.data,
            defaultList: res.data
          })
        })
      } else {
        this.getMyCollectList().then(res => {
          this.setData({
            pageList,
            collectList: res.data,
            defaultList: res.data
          })
        })
      }
    } else {
      this.setData({
        pageList,
        defaultList: this.data[key]
      })
    }
  },
  onShareAppMessage: function(options) {
　　return app.wxShare({options})
  }
})
