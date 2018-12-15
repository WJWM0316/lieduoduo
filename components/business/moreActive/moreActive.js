// components/business/moreActive/moreActive.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    avatarList: Array,
    type: Number
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
    toMore () {
      wx.navigateTo({
        url: "/page/applicant/pages/more/more?type=this.properties.type"
      })
    }
  }
})
