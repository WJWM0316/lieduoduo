// components/functional/bindPhone/bindPhone.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    phone: '',
    code: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getPhone(e) {
      console.log(e)
      this.setData({
        phone: e.detail.value
      })
    },
    getCode(e) {
      console.log(e)
      this.setData({
        code: e.detail.value
      })
    },
    sendCode() {
      let data = {
        mobile: this.data.phone
      }
      sendCodeApi(data).then(res => {
      })
    },
    bindPhone() {
      let data = {
        mobile: this.data.phone,
        code: this.data.code
      }
      bindPhoneApi(data).then(res => {
        console.log('手机号码绑定成功')
        wx.setStorageSync('token', res.data.token)
        getApp().globalData.userInfo = res.data
        getApp().globalData.hasLogin = true
      })
    }
  }
})
