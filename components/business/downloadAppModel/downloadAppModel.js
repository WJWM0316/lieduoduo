let app = getApp()
Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
  },
  data: {
    cdnImagePath: app.globalData.cdnImagePath
  },
  methods: {
    download() {
      this.triggerEvent('change')
      let path = encodeURIComponent(`${WEBVIEW}advisor?page=advisor`)
      wx.navigateTo({url: `${COMMON}webView/webView?type=optimal&p=${path}`})
    }
  }
})
