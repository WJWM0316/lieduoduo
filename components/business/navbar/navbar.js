const App = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title:String,
    showNav:{
      type:Boolean,
      value:true
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

  /**
   * 组件的初始数据
   */
  data: {
   
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