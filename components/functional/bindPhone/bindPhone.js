// components/functional/bindPhone/bindPhone.js
import {COMMON} from '../../../config.js'
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hide: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },
  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      this.setData({
        hide: true
      })
    },
    getPhoneNumber(e) {
      app.quickLogin(e).then(res => {
        this.close()
      })
    },
    phoneLogin() {
      wx.navigateTo({
        url: `${COMMON}bindPhone/bindPhone`
      })
    } 
  }
})
