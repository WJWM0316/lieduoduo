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
      wx.navigateTo({
        url: DOWNLOADAPPPATH
      })
    }
  }
})
