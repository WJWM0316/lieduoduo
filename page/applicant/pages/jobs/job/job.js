//index.js
//获取应用实例
import {RECRUITER, APPLICANT, COMMON} from '../../../../../config.js'
import {getSelectorQuery}  from '../../../../../utils/util.js'
import { getPositionListApi } from '../../../../../api/pages/position.js'

const app = getApp()
Page({
  data: {
    // 页面的默认数据列表
    pageList: 'mySeen',
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    result: 0,
    list: ['12月', '11月', '10月', '09月', '08月', '07月', '06月', '05月','04月', '03月', '02月', '01月'],
    companyList: []
  },
  onShow() {
    // wx.setTabBarBadge({
    //   index: 2,
    //   text: '99+'
    // })
    getPositionListApi().then(res => {
      let companyList = res.data
      this.setData({companyList})
    })
  },
  changeCompanyLists(e) {
    let pageList = e.currentTarget.dataset.pageList
    this.setData({ pageList })
  }
})
