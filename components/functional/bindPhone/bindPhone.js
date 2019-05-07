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
  attached: function () {
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
      app.quickLogin(e)
    },
    phoneLogin() {
      this.close()
      wx.navigateTo({
        url: `${COMMON}bindPhone/bindPhone`
      })
    },
    formSubmit(e) {
      app.postFormId(e.detail.formId)
    }
  }
})
