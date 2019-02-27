import {ellipsis} from '../../../utils/canvas.js'
let avatarUrl = ''
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cardData: {
      type: Object,
      value: {}
    },
    type: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  ready() {
    let that = this
    let loadAvatar = new Promise((resolve, reject) => {
      // 头像
      wx.downloadFile({
        url: that.data.cardData.avatar.smallUrl,
        success(res) {
          if (res.statusCode === 200) {
            resolve(res)
            avatarUrl = res.tempFilePath
            that.drawing(avatarUrl)
          }
        },
        fail(e) {
          app.wxToast({title: '图片加载失败，请退出重新生成'})
        }
      })
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    drawing (avatarUrl) {
      let that = this
      let info = this.data.cardData
      const ctx = wx.createCanvasContext('cardCanvas', this)
      switch(this.data.type) {
        case 'recruiter':
          ctx.drawImage(avatarUrl, 160, 73, 100, 100)
          ctx.drawImage('../../../images/zhaopin.png', 0, 0, 420, 336)
          ctx.setFontSize(28)
          ctx.setFillStyle('#ffffff')
          ctx.setTextAlign('center')
          ctx.fillText(info.name, 210, 215)
          ctx.setFontSize(20)
          ctx.setTextAlign('left')
          let r = 17
          function addLabel(item, index) {
            let x=0, y=0
            switch(index) {
              case 0: 
                x = 185
                y = 25
                break
              case 1:
                x = 219
                y = 20
                break
              case 2: 
                x = 152
                y = 95
                break
              case 3:
                x = 271
                y = 84
                break
              case 4: 
                x = 136
                y = 168
                break
              case 5:
                x = 268
                y = 158
                break
            }
            let metricsW = ctx.measureText(item).width // 文本宽度
            if (index === 0 || index === 2 || index === 4) {
              x = x - metricsW - 2*r
            }
            ctx.beginPath()
            ctx.setFillStyle('#8452A7')
            ctx.arc(x + r, y + r, r, 0.5*Math.PI, 1.5*Math.PI)
            ctx.arc(x + metricsW + r, y + r, r, 1.5*Math.PI, 0.5*Math.PI)
            ctx.fill()
            ctx.setFillStyle('#ffffff')
            ctx.fillText(item, x + r, y + 24)
          }
          info.personalizedLabels.map((item, index) => {
            addLabel(item.labelName, index)
          })
          ctx.beginPath()
          ctx.setFillStyle('#8452A7')
          let position = `${info.companyInfo.companyShortname} | ${info.position}`
          ctx.setFontSize(24)
          ctx.setTextAlign('center')
          ellipsis(ctx, position, 285, 210, 277, '#282828', {color: '#FFDC29', r: 25, y:243, maxWidth: 420})
          ctx.draw(true, () => {
            setTimeout(() => {
              wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                quality: 1,
                canvasId: 'canvas',
                success(res) {
                  console.log(res, 1)
                },
                fail(e) {
                  console.log(e, 2)
                }
              }, that)
            }, 3000)
          })
        break
      }
      
    }
  }
})
