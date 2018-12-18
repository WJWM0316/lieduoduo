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
  methods: {
    onGotUserInfo(e) {
      console.log(e, 1111)
      let data = {
        ssToken: wx.getStorageSync('sessionToken'),
        iv_key: e.detail.iv,
        data: e.detail.encryptedData
      }
      loginApi(data).then(res => {
        if (res.detail.errMsg === 'getUserInfo:ok') {
          // 有token说明已经绑定过用户了
          if (res.data.token) {
            getApp().globalData.userInfo = res.data
            wx.setStorageSync('token', res.data.token)
            wx.removeStorageSync('sessionToken')
            wx.reLaunch({
              url: `/${res.data.page}`
            })
          }
        }
      })
    }
  }
})
