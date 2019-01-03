      //app.js
import {loginApi} from 'api/pages/auth.js'
import {getPersonalResumeApi} from 'api/pages/center.js'
import {getRecruiterDetailApi} from 'api/pages/recruiter.js'
let app = getApp()
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
  },
  globalData: {
    identity: wx.getStorageSync('choseType'), // 身份标识
    hasLogin: false, // 判断是否登录
    userInfo: '', // 用户信息， 判断是否授权
    navHeight: 0,
    cdnImagePath: 'https://attach.lieduoduo.ziwork.com/images',
    resumeInfo: {}, // 个人简历信息
    recruiterDetails: {}, // 招聘官详情信息
    systemInfo: wx.getSystemInfoSync() // 系统信息
  },
  // 获取最全的角色信息
  getAllInfo() {
    return new Promise((resolve, reject) => {
      if (wx.getStorageSync('choseType') === 'APPLICANT') {
        if(!this.globalData.resumeInfo.uid) {
          getPersonalResumeApi().then(res0 => {
            this.globalData.resumeInfo = res0.data
            resolve(res0.data)
          })
        } else {
          resolve(this.globalData.resumeInfo)
        }
      } else {
        if(!this.globalData.recruiterDetails.uid) {
          getRecruiterDetailApi().then(res0 => {
            this.globalData.recruiterDetails = res0.data
            resolve(res0.data)
          })
        } else {
          resolve(this.globalData.recruiterDetails)
        }
      }
    })
    // if (wx.getStorageSync('choseType') === 'APPLICANT') {
    //   getPersonalResumeApi().then(res0 => {
    //     this.globalData.resumeInfo = res0.data
    //   })
    // } else {
    //   getRecruiterDetailApi().then(res0 => {
    //     this.globalData.recruiterDetails = res0.data
    //   })
    // }
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
                this.getAllInfo()
                console.log('用户已授权')
                resolve(res.userInfo)
              }
            })
          }
        }
      })
    })
  },
  // 授权button 回调
  onGotUserInfo(e) {
    let that = this
    return new Promise((resolve, reject) => {
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
                that.globalData.userInfo = res.data
                that.globalData.hasLogin = true
                wx.setStorageSync('token', res.data.token)
                that.getAllInfo()
                console.log('用户已认证')
              } else {
                console.log('用户未绑定手机号')
                wx.setStorageSync('sessionToken', res.data.sessionToken)
              }
              resolve(res)
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