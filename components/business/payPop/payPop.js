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
    lists: [],
    cdnImagePath: app.globalData.cdnImagePath,
  },
  attached () {
    setTimeout(() => {
      let lists = []
      if(this.data.type == 1) {
        lists = [
          {
            text: '畅聊职位',
            img: `${this.data.cdnImagePath}img_chat_introduction_1@2x.png`
          },
          {
            text: '高效约面',
            img: `${this.data.cdnImagePath}img_chat_introduction_2@2x.png`
          },
          {
            text: '了解面试进展',
            img: `${this.data.cdnImagePath}img_chat_introduction_3@2x.png`
          },
          {
            text: '受邀才扣费',
            img: `${this.data.cdnImagePath}img_chat_introduction_4@2x.png`
          }
        ]
      } else {
        lists = [
          {
            text: '顾问跟进',
            img: `${this.data.cdnImagePath}img_adviser_introduction_1@2x.png`
          },
          {
            text: '帮你沟通',
            img: `${this.data.cdnImagePath}img_adviser_introduction_2@2x.png`
          },
          {
            text: '撮合约面',
            img: `${this.data.cdnImagePath}img_adviser_introduction_3@2x.png`
          },
          {
            text: '到场才扣费',
            img: `${this.data.cdnImagePath}img_adviser_introduction_4@2x.png`
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
