const app = getApp()

Page({
  data: {
    navH: app.globalData.navHeight,
    tab: '1'
  },
  onClickTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({tab})
  }
})