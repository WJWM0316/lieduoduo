//app.js
import {getSessionKeyApi} from 'api/pages/auth.js'
App({
  onLaunch: function () {
    // 获取导航栏高度
    wx.getSystemInfo({
      success: res => {
        //导航高度
        this.globalData.navHeight = res.statusBarHeight + 46
      },
      fail: err => {
        console.log(err)
      }
    })
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
    navHeight: 0,
    cdnImagePath: 'https://attach.lieduoduo.ziwork.com/'
  },
  checkLogin () {
    return new Promise((resolve, reject) => {
      // 调用微信登录获取本地session_key
      wx.login({
        success: function (res) {
          // console.log('rquire login', res)
          // 请求接口获取服务器session_key
          const getSessionKeyParams = {
            code: res.code
          }
          getSessionKeyApi(getSessionKeyParams).then(res => {
            console.log('require:获取sessionkey成功', res)
            // if (res.data.token) {
            //   wx.setStorageSync('token', res.data.token)
            // }
            // // 为了获取用户信息
            // if (res.data.key) {
            //   wx.setStorageSync('key', res.data.key)
            // }
            // if (res.data.vkey) {
            //   wx.setStorageSync('vkey', res.data.vkey)
            // }
            // if (res.code === 0) {
            //   console.log('用户在其他平台已完成授权，不需要再次授权')
            //   // 获取用户信息存于store
            //   getUserInfoApi().then(res => {
            //     Vue.prototype.$store.dispatch('userInfo', res.data)
            //     console.log('已将个人信息存入store', Vue.prototype.$store.getters.userInfo)
            //   }).catch(e => {
            //     console.log(e)
            //   })

            //   getShareConfig().then(res => {
            //     Vue.prototype.$store.dispatch('shareInfo', res.data)
            //     console.log('已将分享信息存入store1', Vue.prototype.$store.getters.shareInfo)
            //   })
            // }
            // if (res.code === 201) {    
            //   Vue.prototype.$store.dispatch('needAuthorize', true) // 需要授权框
            // }
            resolve(res)
          }).catch(e => {
            console.log(e, 1111111111)
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