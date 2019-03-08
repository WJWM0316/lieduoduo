//app.js
import {loginApi, checkSessionKeyApi, bindPhoneApi, uploginApi} from 'api/pages/auth.js'
import {formIdApi} from 'api/pages/common.js'
import {getPersonalResumeApi} from 'api/pages/center.js'
import {getRecruiterDetailApi} from 'api/pages/recruiter.js'
import {COMMON,RECRUITER,APPLICANT} from "config.js"
import {getUserRoleApi} from "api/pages/user.js"
import {quickLoginApi} from 'api/pages/auth.js'
import {shareC, shareB} from 'utils/shareWord.js'
let app = getApp()
let that = null
let formIdList = []
App({
  onLaunch: function () {
    // 获取导航栏高度
    this.checkUpdateVersion()
    wx.getSystemInfo({
      success: res => {
        //导航高度
        console.log(res, '系统信息')
        this.globalData.navHeight = res.statusBarHeight + 46
        if (res.model.indexOf('iPhone X') !== -1) {
          this.globalData.isIphoneX = true
        }
        if (res.system.indexOf('iOS') !== -1) {
          this.globalData.isIphone = true
        }
      },
      fail: err => {
        console.log(err)
      }
    })
    this.login()
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
    pageCount: 20,
    isIphoneX: false,
    isIphone: false,
    systemInfo: wx.getSystemInfoSync() // 系统信息
  },
  // 登录
  login() {
    that = this
    wx.login({
      success: function (res0) {
        wx.setStorageSync('code', res0.code)
        loginApi({code: res0.code}).then(res => {
          that.globalData.identity = wx.getStorageSync('choseType')
          // 有token说明已经绑定过用户了
          if (res.data.token) {
            wx.setStorageSync('token', res.data.token)
            that.loginedLoadData()
            that.globalData.hasLogin = true

            // 登陆回调
            if (that.loginInit) {
              that.loginInit()
            }
            that.loginInit = function () {}
            console.log('用户已认证')
          } else {
            console.log('用户未绑定手机号', 'sessionToken', res.data.sessionToken)
            that.checkLogin().then(() => {
              // 登陆回调
              if (that.loginInit) {
                that.loginInit()
              }
              that.loginInit = function () {}
            })
            wx.setStorageSync('sessionToken', res.data.sessionToken)
          }
          var pages = getCurrentPages() //获取加载的页面
          let pageUrl = pages[0].route
          if (pageUrl !== 'page/applicant/pages/index/index') {
            if (!wx.getStorageSync('choseType')) {
              wx.setStorageSync('choseType', 'APPLICANT')
              that.globalData.identity = 'APPLICANT'
            }
          }
          
        })
      },
      fail: function (e) {
        console.log('登录失败', e)
      }
    })
  },
  // 退出登录
  uplogin() {
    uploginApi().then(res => {
      let sessionToken = wx.getStorageSync('sessionToken')
      wx.clearStorageSync()
      wx.setStorageSync('sessionToken', sessionToken)
      this.globalData.identity = ''
      this.globalData.hasLogin = false
      this.globalData.resumeInfo = {}
      this.globalData.recruiterDetails = {}
      this.loginInit = false
      wx.switchTab({url: `${APPLICANT}index/index`})
    })
  },
  // 获取最全的角色信息
  getAllInfo() {
    return new Promise((resolve, reject) => {
      if (wx.getStorageSync('choseType') === 'RECRUITER') {
        getRecruiterDetailApi().then(res0 => {
          this.globalData.recruiterDetails = res0.data
          this.globalData.isRecruiter = 1
          if (this.pageInit) { // 页面初始化
            this.pageInit() //执行定义的回调函数
          }
          resolve(res0.data)
        })
      } else {
        getPersonalResumeApi().then(res0 => {
          this.globalData.resumeInfo = res0.data
          this.globalData.isJobhunter = 1
          if (this.pageInit) { // 页面初始化
            this.pageInit() //执行定义的回调函数
          }
          resolve(res0.data)
        })
      }
    })
  },
  // 获取角色身份
  getRoleInfo() {
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
      this.getRoleInit = function () {}
    })
  },
  // 登陆成功后下载一下数据
  loginedLoadData() {
    this.getAllInfo()
    this.getRoleInfo()
  },
  // 检查微信授权
  checkLogin () {
    let that = this
    return new Promise((resolve, reject) => {
      wx.login({
        success: function (res0) {
          wx.setStorageSync('code', res0.code)
          wx.getSetting({
            success: res => {
              var pages = getCurrentPages() //获取加载的页面
              let pageUrl = `/${pages[0].route}`
              if (res.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                checkSessionKeyApi({session_token: wx.getStorageSync('sessionToken')}).then(res0 => {
                  wx.getUserInfo({
                    success: res => {
                      // 可以将 res 发送给后台解码出 unionId
                      that.globalData.userInfo = res.userInfo
                      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                      // 所以此处加入 callback 以防止这种情况
                      if (that.userInfoReadyCallback) {
                        that.userInfoReadyCallback(res)
                      }
                      const e = {}
                      e.detail = res
                      if (!that.globalData.isIphone) {
                        that.onGotUserInfo(e)
                      }
                      console.log('用户已授权')
                      resolve(res)
                    }
                  })
                }).catch(e => {
                  if (pageUrl !== `${APPLICANT}index/index`) {
                    wx.navigateTo({
                      url: `${COMMON}auth/auth`
                    })
                  }
                })
              } else {
                wx.removeStorageSync('sessionToken')
                if (pageUrl !== `${APPLICANT}index/index`) {
                  wx.navigateTo({
                    url: `${COMMON}auth/auth`
                  })
                }
              }
            }
          })
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
        that.globalData.userInfo = e.detail.userInfo
        let wxLogin = function () {
          // 请求接口获取服务器session_key
          var pages = getCurrentPages() //获取加载的页面
          let pageUrl = pages[0].route
          let params = ''
          for (let i in pages[0].options) {
            params = `${params}${i}=${pages[0].options[i]}&`
          }
          pageUrl = `${pageUrl}?${params}`
          data.code = wx.getStorageSync('code')
          if (wx.getStorageSync('sessionToken')) {
            data.session_token = wx.getStorageSync('sessionToken')
          }
          loginApi(data).then(res => {
            wx.removeStorageSync('code')
            // 有token说明已经绑定过用户了
            if (res.data.token) {
              wx.setStorageSync('token', res.data.token)
              wx.setStorageSync('sessionToken', res.data.sessionToken)
              that.globalData.hasLogin = true
              that.loginedLoadData()
              console.log('用户已认证')
            } else {
              console.log('用户未绑定手机号')
              that.globalData.userInfo = res.data
              wx.setStorageSync('sessionToken', res.data.sessionToken)
            }
            resolve(res)
            if (!isNeedUrl) {
              wx.reLaunch({
                url: `/${pageUrl}`
              })
            } else {
              wx.navigateBack({
                delta: 1
              })
            }
          }).catch(e => {
            wx.login({
              success: function (res0) {
                wx.setStorageSync('code', res0.code)
              }
            })
            reject(e)
          })
        }
        wxLogin()
      }
    })
  },
  // 微信快速登陆
  quickLogin(e) {
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      let data = {
        iv_key: e.detail.iv,
        data: e.detail.encryptedData
      }
      return new Promise((resolve, reject) => {
        quickLoginApi(data).then(res => {
          if (res.data.token) {
            wx.setStorageSync('token', res.data.token)
            this.loginedLoadData()
            this.globalData.hasLogin = true
            var pages = getCurrentPages() //获取加载的页面
            let pageUrl = pages[0].route
            let params = ''
            for (let i in pages[0].options) {
              params = `${params}${i}=${pages[0].options[i]}&`
            }
            pageUrl = `${pageUrl}?${params}`
            wx.reLaunch({
              url: `/${pageUrl}`
            })
            resolve(res)
          } 
        }).catch(e => {
          this.checkLogin()
        })
      })
    }  
  },
  // 手机登陆
  phoneLogin(data) {
    return new Promise((resolve, reject) => {
      bindPhoneApi(data).then(res => {
        wx.setStorageSync('token', res.data.token)
        wx.setStorageSync('sessionToken', res.data.sessionToken)
        this.globalData.hasLogin = true
        this.loginedLoadData()
        resolve(res)
      }).catch(e => {
        if (e.code !== 604) {
          this.checkLogin()
        }
      })
    })
  },
  checkUpdateVersion() {
    //判断微信版本是否 兼容小程序更新机制API的使用
    if (wx.canIUse('getUpdateManager')) {
      //创建 UpdateManager 实例
      const updateManager = wx.getUpdateManager();
      //检测版本更新
      updateManager.onCheckForUpdate(function(res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          //监听小程序有版本更新事件
          updateManager.onUpdateReady(function() {
            //TODO 新的版本已经下载好，调用 applyUpdate 应用新版本并重启 （ 此处进行了自动更新操作）
            updateManager.applyUpdate();
          })
          updateManager.onUpdateFailed(function() {
            // 新版本下载失败
            wx.showModal({
              title: '已经有新版本喽~',
              content: '请您删除当前小程序，到微信 “发现-小程序” 页，重新搜索打开哦~',
            })
          })
        }
      })
    } else {
      //TODO 此时微信版本太低（一般而言版本都是支持的）
      wx.showModal({
        title: '溫馨提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
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
      duration,
      success() {
        setTimeout(() => {
          // 自定义一个回调函数
          callback()
        }, duration)
      }
    })
  },
  // 微信确认弹框
  wxConfirm({title, content, showCancel = true, cancelText = '取消', confirmText = '确定', cancelColor = '#BCBCBC', confirmColor = '#652791', confirmBack = function() {}, cancelBack = function() {}}) {
    wx.showModal({
      title,
      content,
      cancelText,
      cancelColor,
      confirmColor,
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
  wxShare({options, title, path, imageUrl, noImg, btnTitle, btnPath, btnImageUrl}) {
    let that = this
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    if (!title) {
      title = wx.getStorageSync('choseType') !== 'RECRUITER' ? shareC : shareB
    }
    if (!path) {
      path = wx.getStorageSync('choseType') !== 'RECRUITER' ? `${APPLICANT}index/index` : `${RECRUITER}index/index`
    }
    if (!imageUrl) {
      imageUrl = wx.getStorageSync('choseType') !== 'RECRUITER' ? `${this.globalData.cdnImagePath}shareC.png` : `${this.globalData.cdnImagePath}shareB.png`
    }
    if (noImg) {
      imageUrl = ''
    }
    let shareObj = {
      title: title,        // 默认是小程序的名称(可以写slogan等)
      path: path,        // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: imageUrl,     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      success: function(res){
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok'){
        }
      },
      fail: function(){
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel'){
        // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail'){
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
    let identity = wx.getStorageSync('choseType')
    if (identity === 'RECRUITER') {
      wx.setStorageSync('choseType', 'APPLICANT')
      this.globalData.identity = 'APPLICANT'
      wx.reLaunch({
        url: `${APPLICANT}index/index`
      })
      this.getAllInfo()
    } else {
      if (!this.globalData.hasLogin) {
        wx.navigateTo({
          url: `${COMMON}bindPhone/bindPhone`
        })
      } else {
        wx.setStorageSync('choseType', 'RECRUITER')
        this.globalData.identity = 'RECRUITER'
        this.getAllInfo()
        if (!this.globalData.isRecruiter) {
          wx.reLaunch({
            url: `${RECRUITER}user/company/apply/apply`
          })
        } else {
          wx.reLaunch({
            url: `${RECRUITER}index/index`
          })
        }
      }
      
      
    }
  },
  // 收集formId
  postFormId(id) {
    console.log(`=======================收集到这个formId了 ${id}=========================`)
    formIdList.push(id)
    if (formIdList.length >= 3) {
      if (wx.getStorageSync('sessionToken') || wx.getStorageSync('token')) {
        formIdApi({form_id: formIdList}).then(res => {
          formIdList = []
        })
      }
    }
  },
  /**
     * 获取二维码参数对象
     */
  getSceneParams (scene) {
    scene = decodeURIComponent(scene)
    scene = scene.indexOf('?') === 0 ? scene.substr(1) : scene
    const params = scene.split('&')
    const obj = {}
    params.forEach(item => {
      if (item) {
        const param = item.split('=')
        obj[param[0]] = param[1]
      }
    })
    return obj
  }
})