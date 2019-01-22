// components/layout/shareBtn/shareBtn.js
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
    }
  }
})
