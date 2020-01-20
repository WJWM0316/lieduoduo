import {
  DOWNLOADAPPPATH
} from '../../../config.js'
let app = getApp()
Component({
  properties: {
    className: {
      type: String,
      value: 'style1'
    },
    stamp: {
      type: String,
      value: 'stamp1'
    }
  },
  data: {
    cdnPath: app.globalData.cdnImagePath,
  },
  methods: {
    jump() {
      let url = this.data.stamp === 'stamp1' ? `${DOWNLOADAPPPATH}${encodeURIComponent(`&pageType=1`)}` : `${DOWNLOADAPPPATH}${encodeURIComponent(`&pageType=2`)}`
      wx.navigateTo({url})
    }
  }
})
