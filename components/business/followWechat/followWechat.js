const app = getApp()
Component({

  /**
   * 组件的初始数据
   */
  data: {
    cdnImagePath: app.globalData.cdnImagePath,
    isIphoneX: app.globalData.isIphoneX,
    userInfo: null,
    officialId: 0,
    showPop: false,
    authPop: false,
  },

  attached () {
    this.setData({officialId: app.globalData.officialId, userInfo: app.globalData.userInfo})
  },
  methods: {
    close (e) {
      if (e.currentTarget.dataset.type !== 'authPop') {
        let userInfo = this.data.userInfo
        let officialId = 1
        app.globalData.officialId = 1
        app.globalData.userInfo = userInfo
        this.setData({userInfo, officialId, showPop: false})
      } else {
        this.setData({authPop: false})
      }
    },
    show () {
      app.wxReportAnalytics('btn_report', {
        btn_type: 'follow_Wechat'
      })
      if (app.globalData.userInfo && app.globalData.userInfo.nickname) {
        this.setData({showPop: true})
      } else {
        this.setData({authPop: true})
      }
    },
    onGotUserInfo (e) {
      let that = this
      app.onGotUserInfo(e, 'closePop').then(res => {
        that.setData({authPop: false})
        app.wxToast({
          title: '关联成功',
          icon: 'success',
          callback () {
            that.setData({showPop: true})
          }
        })
      })
    }
  }
})
