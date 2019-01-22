// page/common/pages/poster/position/position.js
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
    app.pageInit = () => {
      info = app.globalData.recruiterDetails
      console.log(info)
      let that = this
      const ctx = wx.createCanvasContext('canvas')
      ctx.width = 750
      ctx.setFillStyle('#652791')
      ctx.fillRect(0, 0, 750, 2500)

      
      // 头像
      ctx.drawImage(info.avatar.url, 290, 71, 168, 168)
      // 背景图1
      ctx.drawImage('../../../../../images/j1.png', 0, 0, 750, 515)
      // 画资料
      ctx.setFontSize(46)
      ctx.setFillStyle('#fff')
      ctx.setTextAlign('center')
      ctx.fillText(info.name, 375, 305)
      ctx.setFontSize(26)
      ctx.fillText(info.position, 375, 350)
      ctx.setFontSize(28)
      let cutString = ''
      let ellipsisWidth = ctx.measureText('...').width
      if (ctx.measureText(info.signature).width > 466) {
        for (let i = 0; i < info.signature.length; i++) {
          cutString = cutString + info.signature[i]
          if (ctx.measureText(cutString).width >= 466 - ellipsisWidth) {
            cutString = cutString + '...'
            ctx.fillText(cutString, 375, 397)
            break
          }
        }
      } else {
        ctx.fillText(info.signature, 375, 397)
      }

      let curHeight = 515

      // 开始主要内容
      ctx.drawImage('../../../../../images/a7.png', 0, curHeight, 750, 100)
      ctx.drawImage('../../../../../images/a6.png', 79, curHeight - 20, 163, 32)
      ctx.setFontSize(28)
      ctx.setTextAlign('left')
      ctx.setFillStyle('#282828')
      ctx.fillText('个人简介', 114, curHeight + 6)
      
      // 描述
      curHeight = curHeight + 60
      let descString = ''
      let descWidth = 0
      for (let i = 0; i < info.brief.length; i++) {
        descString = descString + info.brief[i]
        descWidth = ctx.measureText(descString).width
        if (info.brief[i] === '↵' || descWidth > 590) {
          ctx.drawImage('../../../../../images/a7.png', 0, curHeight, 750, 48)
          ctx.fillText(descString.slice(0, descString.length-1), 80, curHeight)
          descString = ''
          curHeight += 48
        }
      }
      // 在招职位
      ctx.drawImage('../../../../../images/a7.png', 0, curHeight, 750, 100)
      curHeight = curHeight + 30
      ctx.drawImage('../../../../../images/a6.png', 79, curHeight, 163, 32)
      ctx.fillText('在招职位', 114, curHeight + 26)



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