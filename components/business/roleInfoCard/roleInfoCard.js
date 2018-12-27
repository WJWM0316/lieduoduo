// components/business/roleInfoCard/roleInfoCard.js
Component({
  externalClasses: ['my-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    roleType: {
      type: String
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
    makePhoneCall() {
      wx.makePhoneCall({
        phoneNumber: '13543498702'
      })
    },
    setClipboardData() {
      wx.setClipboardData({
        data: '1111111',
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
