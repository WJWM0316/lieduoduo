const app = getApp()

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
    showBindMobile: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeMobile() {
      this.setData({showBindMobile: !this.data.showBindMobile})
    },
    hunterJob() {
      app.wxConfirm({
        title: '身份切换',
        content: `是否继续前往求职端？`,
        confirmBack() {
          //
        }
      })
    }
  }
})
