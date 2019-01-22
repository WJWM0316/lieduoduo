import {COMMON} from '../../../config.js'
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
    jump() {
      switch(thia.data.posterType) {
        case 'position':
          wx.navigateTo({
            url: `${COMMON}poster/position/position`
          })
          break
        case 'position':
          wx.navigateTo({
            url: `${COMMON}poster/position/position`
          })
          break
        case 'position':
          wx.navigateTo({
            url: `${COMMON}poster/position/position`
          })
          break
      }
      
      wx.setStorageSync('posterData', this.data.posterData)
      this.setData({showChoose: false})
    }
  }
})
