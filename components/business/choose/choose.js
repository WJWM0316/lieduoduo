// components/business/choose/choose.js
import {RECRUITER, APPLICANT} from '../../../config.js'
let identity = 'APPLICANT'
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isChose: false
  },
  attached: function () {
    let choseType = wx.getStorageSync('choseType') || null
    if (choseType) {
      this.setData({
        isChose: true
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    jump(e) {
      if (e.currentTarget.dataset.identity === 'APPLICANT') {
        identity = 'APPLICANT'
      } else {
        identity = 'RECRUITER'
      }
      wx.setStorageSync('choseType', identity)
    },
    onGotUserInfo(e) {
      getApp().onGotUserInfo(e, true).then(res => {
        if (identity === 'RECRUITER') {
          wx.reLaunch({
            url: `${RECRUITER}index/index`
          })
        } else {
          wx.reLaunch({
            url: `${APPLICANT}index/index`
          })
          this.setData({
            isChose: true
          })
        }
      })
    }
  }
})
