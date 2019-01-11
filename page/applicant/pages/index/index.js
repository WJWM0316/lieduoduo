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
    moreList: [],
    activeList: [],
    redDotActiveList: false // 招聘官动态红点
  },
  onLoad: function () {
    // getAvartListApi().then(res => {
    //   this.setData({
    //     moreList: res.data.moreRecruiter,
    //     activeList: res.data.recruiterDynamic,
    //     redDotActiveList: res.data.redDotJobHunterCollectList && res.data.redDotJobHunterViewList
    //   })
    // })
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
      geMyBrowseUsersApi().then(res => {
        this.setData({
          companyList:res.data
        })
      })
    } else {
      app.pageInit = () => {
        geMyBrowseUsersApi().then(res => {
          this.setData({
            companyList:res.data
          })
        })
      }
    }
    wx.setTabBarBadge({
      index: 2,
      text: '99+'
    })
  },
  toggle (tab) {
    let tabName = tab || this.data.pageList
    switch (tabName) {
      case 'mySeen':
        return geMyBrowseUsersApi()
        break;
      case 'myInterested':
        return getMyCollectUsersApi()
        break;
      default:
        break;
    }
  },
  changeCompanyLists(e) {
    let pageList = e.currentTarget.dataset.pageList
    this.toggle(pageList).then(res => {
      this.setData({
        pageList,
        companyList: res.data
      })
    })
  },
  onShareAppMessage: function(options) {
　　return app.wxShare({options})
  }
})
