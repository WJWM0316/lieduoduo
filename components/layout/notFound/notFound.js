let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    msg: {
      type: String
    },
    title: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    cdnImagePath: app.globalData.cdnImagePath
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
