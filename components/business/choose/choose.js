// components/business/choose/choose.js
import {RECRUITER, APPLICANT} from '../../../config.js'
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
    jump1() {
      wx.setStorageSync('choseType', 'APPLICANT')
      this.setData({
        isChose: true
      })
    },
    jump0() {
      wx.setStorageSync('choseType', 'RECRUITER')
      wx.redirectTo({
        url: `${RECRUITER}index/index`
      })
    }
  }
})
