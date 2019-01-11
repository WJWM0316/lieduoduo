// components/business/moreActive/moreActive.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    avatarList: Array,
    type: Number,
    redDotActiveList: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    toMore () {
      if (this.properties.type === 1) {
        wx.navigateTo({
          url: "/page/applicant/pages/officerActive/more/more"
        })
      } else {
        wx.navigateTo({
          url: "/page/applicant/pages/officerActive/recruitmentActive/recruitmentActive"
        })
      }
    }
  }
})
