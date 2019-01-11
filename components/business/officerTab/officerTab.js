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
    routeJump (e) {
      const uid = e.currentTarget.dataset.uid
      wx.navigateTo({
        url: `/page/common/pages/recruiterDetail/recruiterDetail?uid=${uid}`
      })
    }
  }
})
