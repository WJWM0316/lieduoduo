//index.js
//获取应用实例
import {RECRUITER, APPLICANT, COMMON} from '../../../../config.js'
import {getSelectorQuery}  from '../../../../utils/util.js'
import {getUserInfoApi} from '../../../../api/pages/user.js'
const app = getApp()
Page({
  data: {
    // 页面的默认数据列表
    pageList: 'mySeen',
    choseType: wx.getStorageSync('choseType') || null,
    userInfo: null,
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
      }
    ]
  },
  onLoad: function () {
    getApp().checkLogin().then(res => {
      getUserInfoApi()
      this.setData({userInfo: res})
    })
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
  },
  onShow() {
    wx.setTabBarBadge({
      index: 2,
      text: '99+'
    })
  },
  changeCompanyLists(e) {
    let pageList = e.currentTarget.dataset.pageList
    this.setData({ pageList })
  }
})
