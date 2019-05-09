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
    userInfo: app.globalData.userInfo,
    showPop: false,
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
    close () {
      this.setData({showPop: false})
      let userInfo = app.globalData.userInfo
      userInfo.officialId = true
      app.globalData.userInfo = userInfo
      this.setData({userInfo})
    },
    show () {
      this.setData({showPop: true})
    },
  }
})
