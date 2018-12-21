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
    },
    customBack: {
      type: Boolean,
      value: false
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
      if (this.data.customBack) {
        this.triggerEvent('backEvent')
      } else {
        wx.navigateBack({delta: 1})
      }
    }
  }
})