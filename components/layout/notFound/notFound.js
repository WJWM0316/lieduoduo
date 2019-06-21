import {APPLICANT,RECRUITER} from "../../../config.js"

let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    msg: {
      type: String
    },
    title: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    cdnImagePath: app.globalData.cdnImagePath
  },

  /**
   * 组件的方法列表
   */
  methods: {
    jump() {
      let identity = wx.getStorageSync('choseType')
      let routes = getCurrentPages()
      let url = identity === 'RECRUITER' ? `${RECRUITER}index/index` : `${APPLICANT}index/index`
      if(routes.length) {
        wx.navigateBack({delta: 1})
      } else {
        wx.reLaunch({url})
      }
    }
  }
})
