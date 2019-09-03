// components/layout/actionSheet/actionSheet.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    openPop: {
      type: Boolean,
      value: false,
      observer (newVal, oldVal) {
        this.setData({openPop: newVal}, () => {
          this.setData({showPop: this.data.openPop})
        })
      }
    },
    title: {
      type: String,
      value: ''
    },
    type: {
      type: String,
      value: ''
    }
  },
  attached () {
  },
  /**
   * 组件的初始数据
   */
  data: {
    showPop: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    stopPageScroll () {
      return false
    },
    close () {
      this.setData({showPop: false}, () => {
        setTimeout(() => {
          this.setData({openPop: false})
        }, 200)
      })
      this.triggerEvent('close')
    }
  }
})
