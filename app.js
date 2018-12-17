//app.js
import {getSessionKeyApi} from 'api/pages/auth.js'
App({
  onLaunch: function () {
    this.checkLogin()
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    cdnImagePath: 'https://attach.lieduoduo.ziwork.com/'
  },
  checkLogin () {
    return new Promise((resolve, reject) => {
      // 调用微信登录获取本地session_key
      wx.login({
        success: function (res) {
          // 请求接口获取服务器session_key
          const getSessionKeyParams = {
            code: res.code
          }
          getSessionKeyApi(getSessionKeyParams).then(res => {
            console.log('require:获取sessionkey成功')
            wx.setStorageSync('code', res.data.sessionToken)
            resolve(res)
          }).catch(e => {
            reject(e)
          })
        },
        fail: function (e) {
          console.log('登录失败', e)
        }
      })
    })
  }
})