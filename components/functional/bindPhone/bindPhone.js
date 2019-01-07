// components/functional/bindPhone/bindPhone.js
import {COMMON} from '../../../config.js'
import {quickLoginApi} from '../../../api/pages/auth.js'

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
    hide: false
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
      let data = {
        iv_key: e.detail.iv,
        data: e.detail.encryptedData
      }
      quickLoginApi(data).then(res => {
      })
    },
    phoneLogin() {
      wx.navigateTo({
        url: `${COMMON}bindPhone/bindPhone`
      })
    } 
  }
})
