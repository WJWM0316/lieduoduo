Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list:{
      type: Array,
      default: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    routeJump (e) {
      let item = e.currentTarget.dataset.item
      wx.navigateTo({
        url: `/page/common/pages/positionDetail/positionDetail?positionId=${item.id}&companyId=${item.companyId}`
      })
    },
    formSubmit(e) {
      getApp().postFormId(e.detail.formId)
    }
  }
})
