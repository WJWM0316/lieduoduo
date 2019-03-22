// components/layout/guidePop.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showPop: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      console.log(111111111)
      this.setData({showPop: false})
    },
    back() {
      wx.navigateBack({
        delta: 1
      })
    }
  }
})
