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
    info = app.globalData.recruiterDetails
    getPositionListApi({recruiter: info.uid, count:2}).then(res => {
      info.positionList = res.data
      console.log(info)
      let that = this
      wx.showLoading({
        title: '正在生成...',
      })
      const ctx = wx.createCanvasContext('canvas')
      ctx.width = 750
      ctx.setFillStyle('#652791')
      ctx.fillRect(0, 0, 750, 2500)

      
      // 头像
      ctx.drawImage(info.avatar.url, 290, 71, 168, 168)

      // 背景图1
      ctx.drawImage('../../../../../images/j1.png', 0, 0, 750, 515)

      // vip
      if (info.companyInfo.id) {
        ctx.drawImage('../../../../../images/vip.png', 410, 190, 46, 46)
      }

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
      if (!info.signature) info.signature = '你还未填写个性签名，说说你的想法吧~'
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
      ctx.drawImage('../../../../../images/a8.png', 0, curHeight, 750, 100)
      ctx.drawImage('../../../../../images/a6.png', 79, curHeight - 20, 163, 32)
      ctx.setFontSize(28)
      ctx.setTextAlign('left')
      ctx.setFillStyle('#282828')
      ctx.fillText('个人简介', 114, curHeight + 6)
      
      // 描述
      curHeight = curHeight + 60
      let descString = ''
      let descWidth = 0
      if (!info.brief) info.brief = '你还未填写个人简介，快去填写吧~'
      for (let i = 0; i < info.brief.length; i++) {
        descString = descString + info.brief[i]
        descWidth = ctx.measureText(descString).width
        if (info.brief[i] === '↵' || descWidth > 590) {
          ctx.drawImage('../../../../../images/a8.png', 0, curHeight, 750, 48)
          ctx.fillText(descString.slice(0, descString.length-1), 80, curHeight)
          descString = ''
          curHeight += 48
        }
      }
      // 在招职位
      ctx.drawImage('../../../../../images/a8.png', 0, curHeight, 750, 100)
      curHeight = curHeight + 30
      ctx.drawImage('../../../../../images/a6.png', 79, curHeight, 163, 32)
      ctx.fillText('在招职位', 114, curHeight + 26)

      curHeight = curHeight + 70

      info.positionList.map((item, index) => {
        positionItem(item, index)
      })

      function positionItem(item, index) {
        ctx.drawImage('../../../../../images/a8.png', 0, curHeight, 750, 135)
        let nameWidth = ctx.measureText(item.positionName).width
        let nameString = ''
        let nameStringWidth = 0
        // 职位名
        ctx.setFontSize(32)
        ctx.setFillStyle('#282828')
        ctx.setTextAlign('left')
        if (nameWidth > 392) {
          for (let i = 0; i < info.positionName.length; i++) {
            nameString = nameString + info.positionName[i]
            nameStringWidth = ctx.measureText(nameString).width
            if (nameStringWidth > 392) {
              ctx.fillText(nameString, 80, curHeight + 32)
            }
          }
        } else {
          ctx.fillText(item.positionName, 80, curHeight + 32)
        }

        // 其他
        ctx.setFontSize(24)
        ctx.fillText(`${item.city}-${item.district} · ${item.workExperienceName} · ${item.educationName}`, 80, curHeight + 72)

        // 薪资
        ctx.setFontSize(36)
        ctx.setFillStyle('#FF7F4C')
        ctx.setTextAlign('right')
        ctx.fillText(`${item.emolumentMin}~${item.emolumentMax}K`, 670, curHeight + 36)

        curHeight = curHeight + 102

        // 虚线
        ctx.beginPath()
        ctx.setLineWidth(1)
        ctx.setStrokeStyle('#CED7DC')
        ctx.setLineDash([4, 6], 0)
        ctx.moveTo(80, curHeight)
        ctx.lineTo(670, curHeight)
        ctx.stroke()

        curHeight = curHeight + 20
      }

      ctx.drawImage('../../../../../images/1547620956(1).jpg', 82, curHeight + 190, 160, 160)
      ctx.drawImage('../../../../../images/j2.png', 0, curHeight, 750, 408)
      ctx.setFontSize(26)
      ctx.setFillStyle('#282828')
      ctx.setTextAlign('center')
      ctx.fillText('长按识别查看全部在招职位', 375, curHeight + 60)
      

      ctx.setFontSize(30)
      ctx.setFillStyle('#fff')
      ctx.setTextAlign('left')

      ctx.fillText('像我这么Nice的招聘官', 280, curHeight + 240)
      ctx.fillText('已经不多见了！', 280, curHeight + 280)
      ctx.setFontSize(24)
      ctx.fillText(`长按识别，查看Ta的详情`, 280, curHeight + 330)

      curHeight = curHeight + 408

      ctx.draw(true, () => {
        setTimeout(() => {
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: 750,
            height: curHeight,
            destWidth: 750 * 2,
            destHeight: curHeight * 2,
            quality: 1,
            canvasId: 'canvas',
            success(res) {
              console.log(res.tempFilePath)
              that.setData({imgUrl: res.tempFilePath, imgH: curHeight})
              wx.hideLoading()
            }
          })
        }, 300)
      })
  
    })
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