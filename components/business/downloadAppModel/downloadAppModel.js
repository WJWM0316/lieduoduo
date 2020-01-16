import { DOWNLOADAPPPATH } from '../../../config.js'
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
      this.triggerEvent('close')
      wx.navigateTo({url: DOWNLOADAPPPATH})
    },
    close() {
      this.triggerEvent('close')
      wx.navigateBack({ delta: 2 })
    }
  }
})
