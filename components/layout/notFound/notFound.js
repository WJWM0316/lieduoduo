import {APPLICANT,RECRUITER} from "../../../config.js"

let app = getApp()
Component({
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
    backEvent() {
      wx.navigateBack({delta: 1})
    },
    jump() {
      let identity = wx.getStorageSync('choseType')
      let pages = getCurrentPages()
      let url = identity === 'RECRUITER' ? `${RECRUITER}index/index` : `${APPLICANT}index/index`
      if(pages.length > 1) {
        wx.navigateBack({delta: 1})
      } else {
        wx.reLaunch({url})
      }
    }
  }
})
