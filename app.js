      //app.js
import {loginApi} from 'api/pages/auth.js'
import {getPersonalResumeApi} from 'api/pages/center.js'
import {getRecruiterDetailApi} from 'api/pages/recruiter.js'
import {COMMON,RECRUITER,APPLICANT} from "config.js"
import {getUserRoleApi} from "api/pages/user.js"

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
    identity: "", // 身份标识
    isRecruiter: false, // 是否认证成为招聘官
    isJobhunter: false, // 是否注册成求职者
    hasLogin: false, // 判断是否登录
    userInfo: '', // 用户信息， 判断是否授权
    navHeight: 0,
    cdnImagePath: 'https://lieduoduo-uploads-test.oss-cn-shenzhen.aliyuncs.com/front-assets/images/',
    companyInfo: {}, // 公司信息
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
  },
  // 检查登录
  checkLogin () {
    return new Promise((resolve, reject) => {
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
                getUserRoleApi().then(res0 => {
                  if (res0.data.isRecruiter) {
                    this.globalData.isRecruiter = true
                  }
                  if (res0.data.isJobhunter) {
                    this.globalData.isJobhunter = true
                  }
                  if (this.getRoleInit) { // 登陆初始化
                    this.getRoleInit() //执行定义的回调函数
                  }
                })
                this.getAllInfo().then(() => {
                  // 没有身份默认求职者
                  if (!wx.getStorageSync('choseType')) {
                    wx.setStorageSync('choseType', 'APPLICANT')
                  }
                  this.globalData.identity = wx.getStorageSync('choseType')
                  if (this.pageInit) { // 页面初始化
                    this.pageInit() //执行定义的回调函数
                  }
                })
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
  onGotUserInfo(e, isNeedUrl) {
    let that = this
    return new Promise((resolve, reject) => {
      if (e.detail.errMsg === 'getUserInfo:ok') {
        // 预防信息解密失败， 失败三次后不再授权
        let loginNum = 0
        let data = {
          iv_key: e.detail.iv,
          data: e.detail.encryptedData
        }
        let wxLogin = function () {
          // 调用微信登录获取本地session_key
          wx.login({
            success: function (res0) {
              // 请求接口获取服务器session_key
              var pages = getCurrentPages() //获取加载的页面
              let pageUrl = pages[0].route
              let params = ''
              for (let i in pages[0].options) {
                params = `${params}${i}=${pages[0].options[i]}&`
              }
              pageUrl = `${pageUrl}?${params}`
              data.code = res0.code
              loginApi(data).then(res => {
                // 有token说明已经绑定过用户了
                if (res.data.token) {
                  wx.setStorageSync('token', res.data.token)
                  that.checkLogin()
                  that.globalData.userInfo = res.data
                  that.globalData.hasLogin = true
                  console.log('用户已认证')
                } else {
                  console.log('用户未绑定手机号')
                  wx.setStorageSync('sessionToken', res.data.sessionToken)
                }
                resolve(res)
                if (!isNeedUrl) {
                  wx.reLaunch({
                    url: `/${pageUrl}`
                  })
                }
              }).catch(e => {
                // wx.getUserInfo({
                //   success: res1 => {
                //     data = {
                //       iv_key: res1.iv,
                //       data: res1.encryptedData
                //     }
                //     wxLogin()
                //   }
                // })
              })
            },
            fail: function (e) {
              console.log('登录失败', e)
            }
          })
        }
        wxLogin()
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
  wxConfirm({title, content, showCancel = true, cancelText = '取消', confirmText = '确定', cancelColor = '#000000', confirmColor = '#2878FF', confirmBack = function() {}, cancelBack = function() {}}) {
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
  },
  // 微信分享
  wxShare({options, title, path, imageUrl, btnTitle, btnPath, btnImageUrl}) {
    let that = this
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    let shareObj = {
      title: title || "小程序找工作神器",        // 默认是小程序的名称(可以写slogan等)
      path: path || '/page/applicant/pages/index/index',        // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: imageUrl || './images/choseIcon1.png',     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      success: function(res){
        // 转发成功之后的回调
        if(res.errMsg == 'shareAppMessage:ok'){
        }
      },
      fail: function(){
        // 转发失败之后的回调
        if(res.errMsg == 'shareAppMessage:fail cancel'){
        // 用户取消转发
        }else if(res.errMsg == 'shareAppMessage:fail'){
        // 转发失败，其中 detail message 为详细失败信息
        }
      }
    }
    // 来自页面内的按钮的转发
    if (options.from == 'button') {
      var eData = options.target.dataset
      shareObj = {
        title: btnTitle || shareObj.title,
        path: btnPath || shareObj.path,
        imageUrl: btnImageUrl || shareObj.imageUrl
      }
    }
    return shareObj
  },
  // 切换身份
  toggleIdentity() {
    if (this.globalData.identity === 'RECRUITER') {
      wx.setStorageSync('choseType', 'APPLICANT')
      this.globalData.identity === 'APPLICANT'
      wx.reLaunch({
        url: `${APPLICANT}index/index`
      })
    } else {
      wx.setStorageSync('choseType', 'RECRUITER')
      this.globalData.identity === 'RECRUITER'
      wx.reLaunch({
        url: `${RECRUITER}index/index`
      })
    }
    app.getAllInfo()
  }
})