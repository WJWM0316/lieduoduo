// components/layout/actionSheet/actionSheet.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    openPop: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
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
    stopPageScroll () {
      return false
    },
    close () {
      this.setData({openPop: false})
      this.triggerEvent('close')
    }
  }
})