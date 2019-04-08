//app.js
import {loginApi, checkSessionKeyApi, bindPhoneApi, uploginApi} from 'api/pages/auth.js'
import {formIdApi, shareStatistics} from 'api/pages/common.js'
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
  onLaunch: function (e) {
    // 获取导航栏高度
    this.checkUpdateVersion()
    this.globalData.startRoute = e
    wx.getSystemInfo({
      success: res => {
        //导航高度
        console.log(res, '系统信息')
        this.globalData.navHeight = res.statusBarHeight + 46
        if (res.model.indexOf('iPhone X') !== -1) {
          this.globalData.isIphoneX = true
        }
        if (res.system.indexOf('iOS') !== -1) {
          this.globalData.isIos = true
        }
      },
      fail: err => {
        console.log(err)
      }
    })
    this.login()
  },
  globalData: {
    startRoute: '',
    identity: "", // 身份标识
    isRecruiter: false, // 是否认证成为招聘官
    isJobhunter: false, // 是否注册成求职者
    hasLogin: false, // 判断是否登录
    userInfo: '', // 用户信息， 判断是否授权
    navHeight: 0,
    cdnImagePath: 'https://attach.lieduoduo.ziwork.com/front-assets/images/',
    companyInfo: {}, // 公司信息
    resumeInfo: {}, // 个人简历信息
    recruiterDetails: {}, // 招聘官详情信息
    pageCount: 20, // 分页数量
    isIphoneX: false, // 是否是Iphonex 系列
    isIos: false, // 是否是 ios
    telePhone: '400-065-5788',  // 联系电话
    systemInfo: wx.getSystemInfoSync() // 系统信息
  },
  // 登录
  login() {
    let that = this
    wx.login({
      success: function (res0) {
        if (!wx.getStorageSync('choseType')) wx.setStorageSync('choseType', 'APPLICANT')
        let params = {}
        let startRouteParams = that.globalData.startRoute.query
        if (startRouteParams.scene) {
          startRouteParams = that.getSceneParams(startRouteParams.scene)
        }
        if (startRouteParams.sourceType) {
          params = {
            sourceType: startRouteParams.sourceType,
            sourcePath: `/${that.globalData.startRoute.path}?${that.splicingParams(startRouteParams)}`
          }
        } else {
          params = {
            sourceType: 'sch',
            sourcePath: `/${that.globalData.startRoute.path}?${that.splicingParams(startRouteParams)}`
          }
        }
        wx.setStorageSync('code', res0.code)
        loginApi({code: res0.code, ...params}).then(res => {
          // 有token说明已经绑定过用户了
          if (res.data.token) {
            wx.setStorageSync('token', res.data.token)
            that.loginedLoadData()
            that.globalData.hasLogin = true
            that.globalData.userInfo = res.data
            console.log('用户已认证')
          } else {
            console.log('用户未绑定手机号', 'sessionToken', res.data.sessionToken)
            wx.setStorageSync('sessionToken', res.data.sessionToken)
          }
          // 登陆回调
          if (that.loginInit) {
            that.loginInit()
          }
          that.loginInit = function () {}
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
      this.globalData.hasLogin = false
      this.globalData.resumeInfo = {}
      this.globalData.recruiterDetails = {}
      this.globalData.isRecruiter = false
      this.globalData.isJobhunter = false
      wx.reLaunch({url: `${COMMON}startPage/startPage`})
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
          this.pageInit = function () {}
          resolve(res0.data)
        }).catch((e) => {
          reject(e)
          if (this.pageInit) { // 页面初始化
            this.pageInit() //执行定义的回调函数
          }
          this.pageInit = function () {}
        })
      } else {
        getPersonalResumeApi().then(res0 => {
          this.globalData.resumeInfo = res0.data
          this.globalData.isJobhunter = 1
          if (this.pageInit) { // 页面初始化
            this.pageInit() //执行定义的回调函数
          }
          this.pageInit = function () {}
          resolve(res0.data)
        }).catch((e) => {
          reject(e)
          if (this.pageInit) { // 页面初始化
            this.pageInit() //执行定义的回调函数
          }
          this.pageInit = function () {}
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
      this.getAllInfo()
      this.getRoleInit = function () {}
    }).catch(() => {
      if (this.getRoleInit) { // 登陆初始化
        this.getRoleInit() //执行定义的回调函数
      }
      this.getAllInfo()
      this.getRoleInit = function () {}
    })
  },
  // 登陆成功后下载一下数据
  loginedLoadData() {
    
    this.getRoleInfo()
  },
  // 检查微信授权
  checkLogin () {
    let that = this
    return new Promise((resolve, reject) => {
      checkSessionKeyApi({session_token: wx.getStorageSync('sessionToken')}).then(res0 => {
        wx.getUserInfo({
          success: res => {
            // 可以将 res 发送给后台解码出 unionId
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (that.userInfoReadyCallback) {
              that.userInfoReadyCallback(res)
            }
            const e = {}
            e.detail = res
            if (!that.globalData.isIos) {
              that.onGotUserInfo(e)
            }
            console.log('用户已授权')
            resolve(res)
          }
        })
      }).catch(e => {
        resolve(res)
        wx.removeStorageSync('sessionToken')
        if (pageUrl !== `${COMMON}startPage/startPage`) {
          wx.navigateTo({
            url: `${COMMON}auth/auth`
          })
        }
      })
    })
  },
  // 授权button 回调
  onGotUserInfo(e, operType) {
    let that = this
    return new Promise((resolve, reject) => {
      if (e.detail.errMsg === 'getUserInfo:ok') {
        // 预防信息解密失败， 失败三次后不再授权
        let loginNum = 0
        let data = {
          iv_key: e.detail.iv,
          data: e.detail.encryptedData,
          ...that.getSource()
        }
        let wxLogin = function () {
          // 请求接口获取服务器session_key
          let pageUrl = that.getCurrentPagePath(0)
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
              that.globalData.userInfo = res.data
              that.loginedLoadData()
              console.log('用户已认证')
            } else {
              console.log('用户未绑定手机号')
              that.globalData.userInfo = res.data
              wx.setStorageSync('sessionToken', res.data.sessionToken)
            }
            resolve(res)
            if (!operType) {
              wx.reLaunch({
                url: pageUrl
              })
            } else {
              if (operType === 'closePop') {
                console.log('授权成功关闭弹窗')
              } else {
                wx.navigateBack({
                  delta: 1
                })
              }              
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
      } else {
        console.log('用户拒绝授权', e.detail.errMsg)
        reject(e.detail.errMsg)
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
            this.globalData.userInfo = res.data
            let pageUrl = this.getCurrentPagePath(0)
            wx.reLaunch({
              url: `${pageUrl}`
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
        if (res.data.token) wx.setStorageSync('token', res.data.token)
        if (res.data.sessionToken) wx.setStorageSync('sessionToken', res.data.sessionToken)
        this.globalData.hasLogin = true
        this.globalData.userInfo = res.data
        this.loginedLoadData()
        resolve(res)
      }).catch(e => {
        if (e.code !== 604) {
          this.checkLogin()
        }
      })
    })
  },
  // 小程序热更新
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
  wxConfirm({title = '', content, showCancel = true, cancelText = '取消', confirmText = '确定', cancelColor = '#BCBCBC', confirmColor = '#652791', confirmBack = function() {}, cancelBack = function() {}}) {
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
  // 身份识别
  identification(options) {
    if (options.identity) {
      let identity = ''
      switch(options.identity) {
        case 'recruiter':
          wx.setStorageSync('choseType', 'RECRUITER')
          identity = 'RECRUITER'
          break
        case 'jobhunter':
          wx.setStorageSync('choseType', 'APPLICANT')
          identity = 'APPLICANT'
          break
      }
      return identity
    } else {
      if (wx.getStorageSync('choseType')) {
        return wx.getStorageSync('choseType')
      } else {
        wx.setStorageSync('choseType', 'APPLICANT')
        return 'APPLICANT'
      }
    }
  },
  // 提示切换身份
  promptSwitch({source, jumpPath, confirmBack, cancelBack, directId, directChat}) {
    let path = this.getCurrentPagePath()
    let content = ''
    if (source === 'RECRUITER') {
      jumpPath ? content = '检测到你是面试官，是否切换面试官' : content = '切换为求职者身份后可使用该功能'
      this.wxConfirm({
        title: '提示',
        content,
        confirmBack: () => {
          if (jumpPath) {
            wx.reLaunch({
              url: jumpPath || `${RECRUITER}index/index`
            })
          } else {
            wx.setStorageSync('choseType', 'APPLICANT')
            this.getAllInfo().then(() => {
              wx.reLaunch({url: path})
            }).catch(e => {
              wx.navigateTo({
                url: `${APPLICANT}center/createUser/createUser?directChat=${encodeURIComponent(path)}`
              })
            })
          }
        },
        cancelBack: () => {
          if (jumpPath) {
            wx.setStorageSync('choseType', 'APPLICANT')
            this.getAllInfo()
          }
        }
      })
    } else {
      jumpPath ? content = '检测到你是求职者，是否切换求职者' : content = '切换为面试官身份后可使用该功能'
      this.wxConfirm({
        title: '提示',
        content,
        confirmBack: () => {
          if (jumpPath) {
            wx.reLaunch({
              url: jumpPath || `${APPLICANT}index/index`
            })
          } else {
            wx.setStorageSync('choseType', 'RECRUITER')
            this.getAllInfo().then(() => {
              wx.reLaunch({url: path})
            })
          }
        },
        cancelBack: () => {
          if (jumpPath) {
            wx.setStorageSync('choseType', 'APPLICANT')
            this.getAllInfo()
          }
        }
      })
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
  // 获取二维码参数对象
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
    if (obj.s) obj.sourceType = obj.s
    if (obj.pid) obj.positionId = obj.pid
    if (obj.cid) obj.companyId = obj.cid
    return obj
  },
  // 判断来源记录
  getSource () {
    let params = {}
    let launch = this.globalData.startRoute
    let route = getCurrentPages()
    let curPath = route[route.length - 1]
    if (launch.path === 'page/common/pages/startPage/startPage' && launch.path === curPath.route) { // 自然搜索使用
      if (curPath.options && curPath.options.sourceType) {
        params.sourceType = curPath.options.sourceType
      } else {
        params.sourceType = 'sch'
      }
      params.sourcePath = `/${launch.path}?${this.splicingParams(curPath.options)}`
    } else {
      if (curPath.options && curPath.options.scene) {
        curPath.options = this.getSceneParams(curPath.options.scene)
        if (curPath.options.s) {
          curPath.options.sourceType = curPath.options.s
        }
      }
      if (curPath.options && curPath.options.sourceType) { // 链接带特殊参数
        params.sourceType = curPath.options.sourceType
        params.sourcePath = `/${curPath.route}?${this.splicingParams(curPath.options)}`
      }
    }
    // 跟踪转发人记录
    if (curPath.options && curPath.options.sCode) params.sCode = curPath.options.sCode
    return params
  },
  // 预览简历
  previewResume (e) {
    if (e.currentTarget.dataset.file.attachType === 'doc') {
      wx.showLoading({
        title: '文档加载中...'
      })
      wx.downloadFile({
        url: e.currentTarget.dataset.file.url,
        success(res) {
          const filePath = res.tempFilePath
          wx.openDocument({
            filePath,
            success(res) {
              wx.hideLoading()
              console.log('打开文档成功')
            }
          })
        },
        fail(e) {
          wx.hideLoading()
          console.log(e)
        }
      })
    } else {
      wx.previewImage({
        current: e.currentTarget.dataset.file.url, // 当前显示图片的http链接
        urls: [e.currentTarget.dataset.file.url] // 需要预览的图片http链接列表
      })
    }
  },
  // 拼接参数成字符串
  splicingParams (params) {
    let string = ''
    for (let i in params) {
      string = `${string}${i}=${params[i]}&`
    }
    string = string.slice(0, string.length-1)
    return string
  },
  // 获取当前页面完整链接
  getCurrentPagePath (index) {
    var pages = getCurrentPages() //获取加载的页面
    if (!index && index !== 0) index = pages.length - 1
    let pageUrl = pages[index].route
    let path = `/${pageUrl}?${this.splicingParams(pages[index].options)}`
    return path
  },
  shareStatistics ({id, type, channel, sCode}) {
    shareStatistics({id, type, channel, sCode}).then(res => {
    })
  }
})