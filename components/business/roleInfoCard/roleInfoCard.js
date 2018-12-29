// components/business/roleInfoCard/roleInfoCard.js
Component({
  externalClasses: ['my-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    roleType: {
      type: String
    },
    cardData: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  attached() {
  },
  /**
   * 组件的方法列表
   */
  methods: {
    makePhoneCall() {
      wx.makePhoneCall({
        phoneNumber: this.data.cardData.mobile
      })
    },
    setClipboardData() {
      wx.setClipboardData({
        data: this.data.cardData.wechat,
        success(res) {
          getApp().wxToast({
            title: '复制成功',
            icon: 'success'
          })
        }
      })
    }
  }
})
