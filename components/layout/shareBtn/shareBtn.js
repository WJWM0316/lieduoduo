import {COMMON} from '../../../config.js'
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
      wx.navigateTo({
        url: `${COMMON}poster/position/position`
      })
      this.setData({showChoose: false})
    }
  }
})
