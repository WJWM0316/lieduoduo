import {getPositionListApi} from '../../../../../api/pages/position.js'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: '',
    imgW: 750,
    imgH: 0,
    openSet: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let info = null
    let that = this
    app.pageInit = () => {
      info = app.globalData.resumeInfo
      console.log(info)
      let that = this
      
      const ctx = wx.createCanvasContext('canvas')
      ctx.width = 750
      ctx.setFillStyle('#652791')
      ctx.fillRect(0, 0, 750, 2500)

      // 头像
      ctx.drawImage(info.avatar.url, 306, 58, 133, 133)

      // 背景图1
      ctx.drawImage('../../../../../images/j4.png', 0, 0, 750, 401)

      // 个人资料
      ctx.setFontSize(46)
      ctx.setFillStyle('#282828')
      ctx.setTextAlign('center')
      ctx.fillText(info.name, 375, 265)

      let curHeight = 265
      if (info.lastCompanyName) {
        ctx.setFontSize(26)
        curHeight = curHeight + 42
        ctx.fillText(`${info.lastCompanyName} | ${info.lastPosition}`, 375, curHeight)
      }

      curHeight = curHeight + 28
      ctx.setFillStyle('#EFE9F4')
      ctx.fillRect(278, curHeight, 195, 38)
      ctx.setFontSize(24)
      ctx.setFillStyle('#652791')
      ctx.fillText(info.jobStatusDesc, 375, curHeight + 28)

      ctx.drawImage('../../../../../images/a7.png', 0, curHeight, 750, 50)

      ctx.setFontSize(24)
      ctx.setTextAlign('left')
       ctx.setFillStyle('#282828')
      let cityWidth = ctx.measureText(info.workAgeDesc).width
      let edWidth = ctx.measureText(`${info.age}岁`).width
      let exWidth = ctx.measureText(`${info.degreeDesc}`).width

      let allWidth = cityWidth + edWidth + exWidth + 90 + 30 + 80
      let msgWidth = 375 - allWidth / 2
      ctx.drawImage('../../../../../images/a1.png', msgWidth, curHeight, 30, 30)
      msgWidth = msgWidth + 40
      ctx.fillText(info.workAgeDesc, msgWidth, curHeight + 25)
      msgWidth = msgWidth + cityWidth + 40
      ctx.drawImage('../../../../../images/a2.png', msgWidth, curHeight, 30, 30)
      msgWidth = msgWidth + 40
      ctx.fillText(`${info.age}岁`, msgWidth, curHeight + 25)
      msgWidth = msgWidth + exWidth + 40
      ctx.drawImage('../../../../../images/a3.png', msgWidth, curHeight, 30, 30)
      msgWidth = msgWidth + 40
      ctx.fillText(info.degreeDesc, msgWidth, curHeight + 25)

      ctx.drawImage('../../../../../images/a7.png', 0, curHeight + 30, 750, 50)
      // 画个性标签
      curHeight = curHeight + 76
      
      let r = 24
      let nextLabel = true
      let position = {}
      position = {
        x: 79,
        y: curHeight
      }

      ctx.setFontSize(26)
      ctx.setStrokeStyle('#fff')
      ctx.setLineWidth(1)
      ctx.drawImage('../../../../../images/a7.png', 0, curHeight, 750, 65)
      info.personalizedLabels.map((item, index) => {
        addLabel(item, index)
      })
      function addLabel(item, index) {
        // 下个标签的宽度
        let newLabelWidth = 0
        if (index < info.personalizedLabels.length-1) {
          newLabelWidth = ctx.measureText(info.personalizedLabels[index+1]).width + 2*r
        }
        
        let metricsW = ctx.measureText(item.labelName).width // 文本宽度
        ctx.setFillStyle('#652791')
        ctx.fillText(item.labelName, position.x + r, position.y + r + 10)
        ctx.setStrokeStyle('#CEC5DF')
        ctx.beginPath()
        ctx.moveTo(position.x + r, position.y)
        ctx.lineTo(position.x + r + metricsW, position.y)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(position.x + r, position.y + r, r, 0.5*Math.PI, 1.5*Math.PI)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(position.x + r + metricsW, position.y + 2*r)
        ctx.lineTo(position.x + r, position.y + 2*r)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(position.x + r + metricsW, position.y + r, r, 1.5*Math.PI, 0.5*Math.PI)
        ctx.stroke()
        // 下一个标签的横坐标
        position.x = position.x + 2*r + metricsW + 16
        // 判断是否需要换行
        if (newLabelWidth > (750 - 78*2 -position.x)) {
          position.x = 78
          position.y = position.y + 2*r + 15
          curHeight = position.y
          ctx.drawImage('../../../../../images/a7.png', 0, curHeight, 750, 65)
        }
      }


      
      









      ctx.draw(true)
    
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.writePhotosAlbum']) {
          that.setData({openSet: true})
        }
      }
    })
  },
  onGotUserInfo(e) {
    app.onGotUserInfo(e, true).then(res => {
      this.setData({userInfo: app.globalData.userInfo})
    })
  },
  saveImg () {
    let that = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              that.setData({openSet: true})
              svae()
            },
            fail (res) {
              if (res.errMsg === 'authorize:fail auth deny') {
                that.setData({openSet: false})
              } 
            }
          })
        } else {
          svae()
        }
       }
    })
    function svae () {
      wx.saveImageToPhotosAlbum({
        filePath: that.data.imgUrl,
        success: function (e) {
          app.wxToast({
            title: '已保存至相册',
            icon: 'success'
          })
        },
        fail: function (e) {
          console.log(e)
          app.wxToast({
            title: '保存失败'
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})