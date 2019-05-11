const app = getApp()
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
    cdnImagePath: app.globalData.cdnImagePath,
    isIphoneX: app.globalData.isIphoneX,
    userInfo: {
      officialId: 1
    },
    showPop: false,
    authPop: false,
  },

  attached () {
    if (app.loginInit) {
      this.setData({userInfo: app.globalData.userInfo})
    } else {
      app.loginInit = () => {
        this.setData({userInfo: app.globalData.userInfo})
      }
    }
  },
  methods: {
    close (e) {
      if (e.currentTarget.dataset.type !== 'authPop') {
        let userInfo = app.globalData.userInfo
        userInfo.officialId = true
        app.globalData.userInfo = userInfo
        this.setData({userInfo, showPop: false})
      } else {
        this.setData({authPop: false})
      }
    },
    show () {
      if (app.globalData.userInfo.nickname) {
        this.setData({showPop: true})
      } else {
        this.setData({authPop: true})
      }
    },
    onGotUserInfo (e) {
      app.onGotUserInfo(e, 'closePop').then(res => {
        this.setData({authPop: false})
        app.wxToast({
          title: '关联成功',
          icon: 'success'
        })
      })
    }
  }
})
