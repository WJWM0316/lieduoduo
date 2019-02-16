import {ellipsis, lineFeed} from '../../../../../utils/canvas.js'

let app = getApp()
let info = null
let avatarUrl = ''
let companyUrl = ''
let qrCodeUrl = ''
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
  drawing (avatarUrl, companyUrl, qrCodeUrl) {
    
    const ctx = wx.createCanvasContext('canvas')
    let that = this
    ctx.width = 750
    ctx.setFillStyle('#652791')
    ctx.fillRect(0, 0, 750, 2600)
    // 头像
    ctx.drawImage(avatarUrl, 80, 40, 98, 98)
    // 背景图1
    ctx.drawImage('../../../../../images/canvas1.png', 0, 0, 750, 402)
    // 个人资料
    ctx.setTextAlign('left')
    ctx.setFillStyle('#ffffff')
    ctx.setFontSize(28)

    ellipsis(ctx, `${info.recruiterInfo.name} | ${info.recruiterInfo.position}`, 360, 212, 85)

    ctx.setFontSize(22)
    ctx.fillText('工作不易，知音难觅，壮士约乎？', 212, 119)

    // 主要内容
    ctx.setTextAlign('center')
    ctx.setFontSize(46)
    ellipsis(ctx, info.positionName, 500, 375, 272)
    ctx.fillText(`${info.emolumentMin}~${info.emolumentMax}K`, 375, 345)
    // ctx.font = "normal normal lighter 46px arial,sans-serif"
    ctx.setFontSize(24)
    ctx.setTextAlign('left')
    let cityWidth = ctx.measureText(info.city).width
    let edWidth = ctx.measureText(info.educationName).width
    let exWidth = ctx.measureText(info.workExperienceName).width
    let allWidth = cityWidth + edWidth + exWidth + 90 + 30 + 80

    let msgWidth = 375 - allWidth / 2
    ctx.drawImage('../../../../../images/a3.png', msgWidth, 404, 30, 30)
    msgWidth = msgWidth + 40
    ctx.fillText(info.city, msgWidth, 428)

    
    msgWidth = msgWidth + cityWidth + 40
    
    ctx.drawImage('../../../../../images/a1.png', msgWidth, 404, 30, 30)
    msgWidth = msgWidth + 40
    ctx.fillText(info.workExperienceName, msgWidth, 428)

    msgWidth = msgWidth + exWidth + 40
    ctx.drawImage('../../../../../images/a2.png', msgWidth, 404, 30, 30)
    msgWidth = msgWidth + 40
    ctx.fillText(info.educationName, msgWidth, 428)

    // 画笔Y坐标
    let curHeight = 483

    // 画个性标签
    let r = 24
    let nextLabel = true
    let position = {}
    position = {
      x: 59,
      y: curHeight
    }

    ctx.setFontSize(26)
    ctx.setStrokeStyle('#fff')
    ctx.setLineWidth(1)
    info.lightspotInfo.map((item, index) => {
      addLabel(item, index)
    })
    function addLabel(item, index) {
      // 下个标签的宽度
      let newLabelWidth = 0
      if (index < info.lightspotInfo.length-1) {
        newLabelWidth = ctx.measureText(info.lightspotInfo[index+1]).width + 2*r
      }
      
      let metricsW = ctx.measureText(item).width // 文本宽度
      ctx.fillText(item, position.x + r, position.y + r + 10)

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
      if (newLabelWidth > (750 - 59*2 -position.x)) {
        position.x = 59
        position.y = position.y + 2*r + 15
        curHeight = position.y
      }
    }

    // 画公司信息
    let companyInfo = info.companyInfo
    if (info.lightspotInfo.length > 0) {
      curHeight = curHeight + 94
    }
    ctx.drawImage(companyUrl, 88, curHeight + 34, 98, 98)
    ctx.drawImage('../../../../../images/canvas4.png', 38, curHeight, 674, 166)
    ctx.setFontSize(32)
    let companyName = companyInfo.companyShortname
    // 需要省略号
    ellipsis(ctx, companyName, 456, 210, curHeight + 75)

    ctx.setFontSize(26)
    // 需要省略号
    let desc = `${companyInfo.industry} · ${companyInfo.financingInfo} · ${companyInfo.employeesInfo}`
    ellipsis(ctx, desc, 456, 210, curHeight + 115)
    

    // 画团队描述
    curHeight = curHeight + 131
    ctx.drawImage('../../../../../images/c1.png', 0, curHeight, 750, 174)
    curHeight = curHeight + 174
    ctx.drawImage('../../../../../images/c2.png', 0, curHeight, 750, 180)
    
    // 画职位标签
    let padding = 20
    curHeight = curHeight + 30
    let teamPosition = {
      x: 80,
      y: curHeight
    }
    ctx.setFontSize(24)
    info.skillsLabel.map((item, index) => {
      addTeamLabel(item, index)
    })
    function addTeamLabel(item, index) {
      let metricsW = ctx.measureText(item.name).width // 当前文本宽度
      ctx.setFillStyle('#EFE9F4')
      ctx.fillRect(teamPosition.x, teamPosition.y, metricsW + 40, 42)
      ctx.setFillStyle('#652791')
      ctx.fillText(item.name, teamPosition.x + padding, teamPosition.y + 29)

      // 下个标签的宽度
      let newLabelWidth = 0
      if (index < info.skillsLabel.length-1) {
        newLabelWidth = ctx.measureText(info.skillsLabel[index+1].name).width + 2*padding
      }

      // 下一个标签的横坐标
      teamPosition.x = teamPosition.x + 2*padding + metricsW + 12

      // 判断是否需要换行
      if (newLabelWidth > (750 - 80 - teamPosition.x)) {
        teamPosition.x = 80
        teamPosition.y = teamPosition.y + 2*padding + 15
        curHeight = teamPosition.y
      }
    }

    let descWidth = 0
    let descString = ''
    let descIndex = 0
    
    curHeight = curHeight + 90
    ctx.setFontSize(28)
    ctx.setFillStyle('#282828')
    if (!info.describe) info.describe = '你还未填写职位详情，快去填写吧~'
    curHeight = lineFeed(ctx, info.describe, 590, 80, curHeight, '../../../../../images/c2.png', 750, 100)
    ctx.drawImage('../../../../../images/c4.png', 0, curHeight - 200, 74, 92)
    ctx.drawImage(qrCodeUrl, 75, curHeight + 88, 170, 170)
    ctx.drawImage('../../../../../images/canvas5.png', 0, curHeight + 10, 750, 287)
    ctx.setFontSize(30)
    ctx.setFillStyle('#fff')
    ctx.fillText('长按打开小程序与Ta约面吧！', 276, curHeight + 160)
    ctx.setFontSize(24)
    ctx.fillText(`Ta还有${info.recruiterInfo.positionNum}个职位在招！`, 276, curHeight + 205)
    curHeight = curHeight + 287
    ctx.draw(true, () => {
      setTimeout(() => {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 750,
          height: curHeight,
          quality: 1,
          canvasId: 'canvas',
          success(res) {
            that.setData({imgUrl: res.tempFilePath, imgH: curHeight})
            wx.hideLoading()
            wx.removeStorageSync('posterData')
          }
        })
      }, 500)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    info = wx.getStorageSync('posterData')
    let that = this
    wx.showLoading({
      title: '正在生成...',
    })
    let loadAvatar = new Promise((resolve, reject) => {
      // 头像
      wx.downloadFile({
        url: info.recruiterInfo.avatar.smallUrl,
        success(res) {
          if (res.statusCode === 200) {
            resolve(res)
            avatarUrl = res.tempFilePath
          }
        },
        fail(e) {
          app.wxToast({title: '图片加载失败，请退出重新生成'})
        }
      })
    })
    let loadCompany = new Promise((resolve, reject) => {
      wx.downloadFile({
        url:  info.companyInfo.logoInfo.smallUrl,
        success(res) {
          if (res.statusCode === 200) {
            resolve(res)
            companyUrl = res.tempFilePath
          }
        },
        fail(e) {
          app.wxToast({title: '图片加载失败，请退出重新生成'})
        }
      })
    })
    let loadQrCode = new Promise((resolve, reject) => {
      // 二维码
      wx.downloadFile({
        url: info.positionQrCode,
        success(res) {
          if (res.statusCode === 200) {
            resolve(res)
            qrCodeUrl = res.tempFilePath
          }
        },
        fail(e) {
          app.wxToast({title: '图片加载失败，请退出重新生成'})
        }
      })
    })
    Promise.all([loadAvatar, loadCompany, loadQrCode]).then((result) => {
      this.drawing (avatarUrl, companyUrl, qrCodeUrl)
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