//index.js
//获取应用实例
import {RECRUITER, APPLICANT, COMMON} from '../../../../config.js'
import {getSelectorQuery}  from '../../../../utils/util.js'

const app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    companyList: [
      {
        id: 1,
        recruiterName: '文双',
        certification: false,
        recruiterPosition: '创始人、CEO',
        companyName: '老虎科技',
        positionNumber: 18
      },
      {
        id: 2,
        recruiterName: '文双',
        certification: true,
        recruiterPosition: '创始人、CEO',
        companyName: '老虎科技',
        positionNumber: 18
      }
    ]
  },
  onLoad: function () {
    let choseType = wx.getStorageSync('choseType') || null
    if (choseType === 'RECRUITER') {
      wx.showModal({
        title: '提示',
        content: '检测到你是招聘官，是否切换招聘端',
        success (res) {
          if (res.confirm) {
            wx.reLaunch({
              url: `${RECRUITER}index/index`
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    }
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  jumpMap: function() {
    wx.redirectTo({
      url: `${COMMON}map/map`
    })
  },
  getResult(e) {
    console.log(e, '返回的数据')
  }
})
