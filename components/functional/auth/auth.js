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
      if (e.detail.errMsg === 'getUserInfo:ok') {
        // 调用微信登录获取本地session_key
        wx.login({
          success: function (res) {
            // 请求接口获取服务器session_key
            var pages = getCurrentPages() //获取加载的页面
            let pageUrl = pages[0].route
            let params = ''
            for (let i in pages[0].options) {
              params = `${params}${i}=${pages[0].options[i]}&`
            }
            pageUrl = `${pageUrl}?${params}`
            let data = {
              code: res.code,
              iv_key: e.detail.iv,
              data: e.detail.encryptedData
            }
            loginApi(data).then(res => {
              // 有token说明已经绑定过用户了
              if (res.data.token) {
                getApp().globalData.userInfo = res.data
                getApp().globalData.hasLogin = true
                wx.setStorageSync('token', res.data.token)
                wx.removeStorageSync('sessionToken')
                console.log('用户已认证')
              } else {
                console.log('用户未绑定手机号')
                wx.setStorageSync('sessionToken', res.data.sessionToken)
              }
              wx.reLaunch({
                url: `/${pageUrl}`
              })
            })
          },
          fail: function (e) {
            console.log('登录失败', e)
          }
        })
      }
    }
  }
})
