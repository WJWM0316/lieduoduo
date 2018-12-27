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
    // this.checkLogin()
  },
  globalData: {
    identity: 'APPLICAN', // 身份标识
    hasLogin: false, // 判断是否登录
    userInfo: null, // 用户信息， 判断是否授权
    navHeight: 0,
    cdnImagePath: 'https://attach.lieduoduo.ziwork.com/images',
    systemInfo: wx.getSystemInfoSync() // 系统信息
  },
  // 检查登录
  checkLogin () {
    return new Promise((resolve, reject) => {
      if (this.globalData.userInfo) {
        resolve(this.globalData.userInfo)
        return
      }
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
                console.log('用户已授权', res.userInfo)
                resolve(res.userInfo)
              }
            })
          } else {
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
                wx.setStorageSync('code', res.code)
                wx.setStorageSync('enterUrl', pageUrl)
                // getSessionKeyApi(getSessionKeyParams).then(res => {
                //   console.log('用户未授权,获取sessionkey成功', res.data.sessionToken)
                //   wx.setStorageSync('sessionToken', res.data.sessionToken)
                // })
              },
              fail: function (e) {
                console.log('登录失败', e)
              }
            })
          }
        }
      })
    })
  },
  // 微信toast
  wxToast({title, icon = 'none', image, mask = true, duration = 1500, callback = function(){} }) {
    // icon - success 显示成功图标，此时 title 文本最多显示 7 个汉字长度
    // icon - loading 显示加载图标，此时 title 文本最多显示 7 个汉字长度
    wx.showToast({
      title,
      icon,
      image,
      mask,
      success() {
        setTimeout(() => {
          // 自定义一个回调函数
          callback()
        }, duration)
      }
    })
  },
  // 微信确认弹框
  wxConfirm({title, content, showCancel = false, cancelText = '取消', confirmText = '确定', cancelColor = '#000000', confirmColor = '#2878FF', confirmBack = function() {}, cancelBack = function() {}}) {
    wx.showModal({
      title,
      content,
      showCancel,
      confirmText,
      success(res) {
        if (res.confirm) {
          confirmBack()
        } else if (res.cancel) {
          cancelBack()
        }
      }
    })
  }
})