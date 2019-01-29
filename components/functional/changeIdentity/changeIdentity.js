const app = getApp()

Component({
  data: {
    showBindMobile: false
  },
  methods: {
    changeMobile() {
      wx.makePhoneCall({
        phoneNumber: '020-61279889'
      })
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
