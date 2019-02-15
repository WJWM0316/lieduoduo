let avatarUrl = ''
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cardData: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  ready() {
    let that = this
    console.log(that.data.cardData, 1111111111)
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
      let info = this.data.cardData
      const ctx = wx.createCanvasContext('cardCanvas', this)
      
      ctx.drawImage(avatarUrl, 40, 56, 100, 100)

      ctx.drawImage('../../../images/jianli.png', 0, 0, 420, 336)
      ctx.setFontSize(28)
      ctx.setFillStyle('#ffffff')
      ctx.setTextAlign('left')
      ctx.fillText(info.name, 160, 106)
      ctx.setFontSize(22)
      ctx.fillText(info.jobStatusDesc, 160, 137)

      let cityWidth = ctx.measureText(item.name).width
      ctx.fillRect(teamPosition.x, teamPosition.y, metricsW + 40, 42)


      ctx.draw(true, () => {
        // setTimeout(() => {
        //   wx.canvasToTempFilePath({
        //     x: 0,
        //     y: 0,
        //     quality: 1,
        //     canvasId: 'canvas',
        //     success(res) {
        //       console.log(res, 1)
        //     }
        //   })
        // }, 500)
      })
    }
  }
})
