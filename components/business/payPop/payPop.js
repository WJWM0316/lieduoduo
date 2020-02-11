const app = getApp()
Component({

  
  /**
   * 组件的属性列表
   */
  properties: {
    openPayPop: {
      type: Boolean,
      value: false
    },
    chargeData: {
      type: Object,
      value: {}
    },
    title: {
      type: String,
      value: ''
    },
    type: {
      type: Number,
      value: 1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    telePhone: app.globalData.telePhone,
    lists: []
  },
  attached () {
    setTimeout(() => {
      let lists = []
      if(this.data.type == 1) {
        lists = [
          {
            text: '畅聊职位'
          },
          {
            text: '高效约面'
          },
          {
            text: '了解面试进展'
          },
          {
            text: '受邀才扣费'
          }
        ]
      } else {
        lists = [
          {
            text: '顾问跟进'
          },
          {
            text: '帮你沟通'
          },
          {
            text: '撮合约面'
          },
          {
            text: '到场才扣费'
          }
        ]
      }
      this.setData({ lists })
    }, 1000)
    
  },
  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      this.setData({openPayPop: !this.data.openPayPop})
      this.triggerEvent('close')
    },
    submit () {
      this.triggerEvent('submit')
    },
    callPhone () {
      wx.makePhoneCall({
        phoneNumber: this.data.telePhone
      })
    }
  }
})
