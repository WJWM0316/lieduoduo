// components/business/auth/auth.js
import {loginApi} from '../../../api/pages/auth.js'
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
  },

  /**
   * 组件的方法列表
   */
  
  attached: function () {
    wx.login({
      success: function (res0) {
        wx.setStorageSync('code', res0.code)
      }
    })
  }, 
  methods: {
    onGotUserInfo(e) {
      getApp().onGotUserInfo(e)
    }
  }
})
