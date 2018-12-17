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
      let data = {
        ssToken: wx.getStorageSync('code'),
        iv_key: e.detail.iv,
        data: e.detail.encryptedData
      }
      loginApi(data).then(res => {
        getApp().globalData.userInfo = res.data
        console.log(getApp().globalData)
      })
    }
  }
})
