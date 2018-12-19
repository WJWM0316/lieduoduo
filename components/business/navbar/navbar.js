const App = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    title: {
      type: String,
      value: '猎多多'
    },
    showNav: {
      type: Boolean,
      value:true
    },
    showBackBtn: {
      type: Boolean,
      value: false
    },
    showHome: {
      type: Boolean,
      value: true
    },
    background: {
      type: String,
      value: '#2878FF'
    },
    color: {
      type: String,
      value: 'white'
    }
  },
  lifetimes: {
    attached() {
      this.setData({
        navH: App.globalData.navHeight
      })
     }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //回退
    navBack() {
      wx.navigateBack({delta: 1})
    },
    //回主页
    backToHomepage() {
      console.log('回到主页')
    }
  }
})