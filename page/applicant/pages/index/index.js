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
    this.init()
  },
  onShow() {
    if (app.globalData.resumeInfo.uid) {
      geMyBrowseUsersApi().then(res => {
        this.setData({
          defaultList:res.data
        })
      })
    } else {
      app.pageInit = () => {
        geMyBrowseUsersApi().then(res => {
          this.setData({
            defaultList:res.data
          })
        })
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
    Promise.all([this.getMyBrowseList(),this.getMyCollectList(),this.getAvartLis()]).then(res => {
      this.setData({
        lookedList: res[0].data,
        collectList: res[1].data,
        defaultList: res[0].data,
        moreList: res[2].data.moreRecruiter,
        activeList: res[2].data.recruiterDynamic,
        redDotActiveList: res[2].data.redDotJobHunterCollectList && res[2].data.redDotJobHunterViewList
      })
    })
  },
  toggle(e) {
    let pageList = e.currentTarget.dataset.pageList
    const key = pageList === 'mySeen'? 'lookedList' : 'collectList'
    this.setData({
      pageList,
      defaultList: this.data[key]
    })
  },
  onShareAppMessage: function(options) {
　　return app.wxShare({options})
  }
})
