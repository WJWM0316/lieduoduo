// components/business/tabBar/tabBar.js
import {RECRUITER, APPLICANT} from '../../../config.js'
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
    list: [
      {
        title: '首页',
        iconPath: `${cdnImagePath}tab_home_nor@3x.png`,
        selectedIconPath: `${cdnImagePath}tab_home_sel@3x.png`,
        active: true,
        path: `${RECRUITER}index/index`
      },
      {
        title: '面试',
        iconPath: `${cdnImagePath}tab_interview_nor@3x.png`,
        selectedIconPath: `${cdnImagePath}tab_interview_sel@3x.png`,
        active: false,
        path: `${RECRUITER}interview/index/index`
      },
      {
        title: '职位管理',
        iconPath: `${cdnImagePath}tab_job_nor@3x.png`,
        selectedIconPath: `${cdnImagePath}tab_job_sel@3x.png`,
        active: false,
        path: `${RECRUITER}position/index/index`
      },
      {
        title: '我的',
        iconPath: `${cdnImagePath}tab_me_nor@3x.png`,
        selectedIconPath: `${cdnImagePath}tab_me_sel@3x.png`,
        active: false,
        path: `${RECRUITER}user/mine/infos/infos`
      }
    ],
    isIphoneX: app.globalData.isIphoneX
  },
  attached() {
    const list = this.data.list
    const currentRoute = '/' + getCurrentPages()[getCurrentPages().length - 1].route
    list.map(field => field.active = field.path === currentRoute ? true : false)
    this.setData({ list })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    toggle(e) {
      
      let companyInfos = wx.getStorageSync('companyInfos')
      if(companyInfos && companyInfos.companyInfo.status !== 1) {

        wx.reLaunch({url: `${RECRUITER}user/company/status/status`})
        return;
      }

      wx.reLaunch({
        url: e.target.dataset.path,
        success: () => wx.removeStorageSync('companyInfos')
      })
    }
  }
})
