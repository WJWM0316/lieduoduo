// components/business/tabBar/tabBar.js
import {RECRUITER, APPLICANT, COMMON} from '../../../config.js'
import { getBottomRedDotApi } from '../../../api/pages/interview.js'
import {
  recruiterList,
  applicantList
} from '../../../utils/navigation.js'

const app = getApp()
const cdnImagePath = app.globalData.cdnImagePath
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabType: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    redDot: {},
    recruiterList,
    applicantList,
    isIphoneX: app.globalData.isIphoneX
  },
  attached() {
    const list = !this.data.tabType  ? this.data.applicantList : this.data.recruiterList
    const currentRoute = '/' + getCurrentPages()[getCurrentPages().length - 1].route
    const identity = wx.getStorageSync('choseType')
    list.map(field => field.active = field.path === currentRoute ? true : false)
    this.setData({ list, identity })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 获取底部栏红点情况
    init() {
      app.getBottomRedDot().then(res => {
        app.globalData.redDotInfos = res.data
        this.setData({redDot: res.data})
        this.triggerEvent('resultevent', res.data)
      })
    },
    toggle(e) {
      if (app.getCurrentPagePath().indexOf(e.target.dataset.path) !== -1) return
      let action = () => {
        wx.removeStorageSync('companyInfos')
        wx.removeStorageSync('cacheData')
      }
      wx.reLaunch({
        url: e.target.dataset.path,
        success: () => action()
      })
    }
  }
})
