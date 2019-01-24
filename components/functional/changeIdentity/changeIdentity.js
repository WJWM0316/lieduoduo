const app = getApp()

Component({
  data: {
    showBindMobile: false
  },
  methods: {
    changeMobile() {
      this.setData({showBindMobile: !this.data.showBindMobile})
    },
    hunterJob() {
      app.wxConfirm({
        title: '身份切换',
        content: `是否继续前往求职端？`,
        confirmBack() {
          app.toggleIdentity()
        }
      })
    }
  }
})
