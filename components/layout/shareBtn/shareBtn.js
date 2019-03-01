import {COMMON} from '../../../config.js'
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    posterData: {
      type: Object
    },
    posterType: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showChoose: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    oper() {
      this.setData({showChoose: true})
    },
    close() {
      this.setData({showChoose: false})
    },
    jump(e) {
      console.log(e, 111)
      switch(this.data.posterType) {
        case 'position':
          if (e.currentTarget.dataset.type === 'position')
            wx.navigateTo({
              url: `${COMMON}poster/position/position`
            })
          else {
            wx.navigateTo({
              url: `${COMMON}poster/exPosition/exPosition`
            })
          }
          break
      }
      wx.setStorageSync('posterData', this.data.posterData)
      this.setData({showChoose: false})
    },
    formSubmit(e) {
      app.postFormId(e.detail.formId)
    }
  }
})
