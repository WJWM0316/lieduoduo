// components/business/officerTab/officerTab.js
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
    routeJump () {
      wx.navigateTo({
        url: '/page/common/pages/positionDetail/positionDetail?positionId=33&companyId=2'
      })
    }
  }
})
