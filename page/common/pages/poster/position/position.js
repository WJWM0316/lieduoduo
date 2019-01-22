// page/common/pages/poster/position/position.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: app.globalData.userInfo,
    info: {
      userName: '李狗蛋',
      positionName: '攻城狮',
      name: 'B端业务高级产品经理',
      xinzi: '3K~5K',
      city: '广州',
      experience: '1-3年',
      education: '本科',
      label: [{name: '年度奖金1'}, {name: '年度奖金2'}, {name: '年度奖金3'}, {name: '年度奖金4'}, {name: '年度奖金5'}],
      companyName: '老虎科技信息有限公司',
      desc: '广告/公关/会展 · 不需要融资 · 1000 · 10000',
      teamLabel: [{name: '# 电子游戏竞技'}, {name: '# 小程序'}, {name: '# 工作标签'}],
      positionDesc: "撒大苏打撒↵1.收到客户反馈老师的飞控技术的开发开始的快递方式的开发是的封建士大夫↵阿三大苏打：↵2.阿三大苏打拉斯科来到拉萨啊实打阿三大苏打拉斯科来到拉萨啊实打阿三大苏打拉斯科来到拉萨啊实打阿三大苏打拉斯科来到拉萨啊实打实↵3.啊撒大苏打撒来到拉萨到拉萨实打↵阿三大苏打：↵4.阿松单卡双卡的斯科拉打开拉萨快乐的时刻安神定魄阿斯顿撒旦阿斯顿阿斯顿啊实打实领导卡拉圣诞快乐ask领导看了ask领导阿斯顿啊asdas"
    },
    imgUrl: '',
    imgW: 750,
    imgH: 0,
    openSet: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const ctx = wx.createCanvasContext('canvas')
    let that = this
    let info = this.data.info
    ctx.width = 750
    ctx.setFillStyle('#652791')
    ctx.fillRect(0, 0, 750, 2500)
    // 头像
    ctx.drawImage('../../../../../images/1547620956(1).jpg', 80, 40, 98, 98)
    // 背景图1
    ctx.drawImage('../../../../../images/canvas1.png', 0, 0, 750, 402)
    // 个人资料
    ctx.setTextAlign('left')
    ctx.setFillStyle('#ffffff')
    ctx.setFontSize(28)
    ctx.fillText(`${info.userName} | ${info.positionName}`, 212, 85)
    ctx.setFontSize(22)
    ctx.fillText('工作不易，知音难觅，壮士约乎？', 212, 119)

    // 主要内容
    ctx.setTextAlign('center')
    ctx.setFontSize(46)
    ctx.fillText(info.name, 375, 272)
    ctx.fillText(info.xinzi, 375, 345)
    // ctx.font = "normal normal lighter 46px arial,sans-serif"
    ctx.setFontSize(24)
    ctx.setTextAlign('left')
    let cityWidth = ctx.measureText(info.city).width
    let edWidth = ctx.measureText(info.education).width
    let exWidth = ctx.measureText(info.experience).width
    let allWidth = cityWidth + edWidth + exWidth + 90 + 30 + 80
    let msgWidth = 375 - allWidth / 2
    ctx.drawImage('../../../../../images/a1.png', msgWidth, 404, 30, 30)
    msgWidth = msgWidth + 40
    ctx.fillText(info.city, msgWidth, 428)
    msgWidth = msgWidth + cityWidth + 40
    ctx.drawImage('../../../../../images/a2.png', msgWidth, 404, 30, 30)
    msgWidth = msgWidth + 40
    ctx.fillText(info.experience, msgWidth, 428)
    msgWidth = msgWidth + exWidth + 40
    ctx.drawImage('../../../../../images/a3.png', msgWidth, 404, 30, 30)
    msgWidth = msgWidth + 40
    ctx.fillText(info.education, msgWidth, 428)

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
    info.label.map((item, index) => {
      addLabel(item, index)
    })
    function addLabel(item, index) {
      // 下个标签的宽度
      let newLabelWidth = 0
      if (index < info.label.length-1) {
        newLabelWidth = ctx.measureText(info.label[index+1].name).width + 2*r
      }
      
      let metricsW = ctx.measureText(item.name).width // 文本宽度
      ctx.fillText(item.name, position.x + r, position.y + r + 10)

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
    curHeight = curHeight + 94
    ctx.drawImage('../../../../../images/1547620956(1).jpg', 88, curHeight + 34, 98, 98)
    ctx.drawImage('../../../../../images/canvas4.png', 38, curHeight, 674, 166)
    ctx.setFontSize(32)
    ctx.fillText(info.companyName, 210, curHeight + 75)
    ctx.setFontSize(26)
    // 需要省略号
    if (ctx.measureText(info.desc).width > 456) {
      let ellipsisWidth = ctx.measureText('...').width
      let cutString = ''
      for (let i = 0; i < info.desc.length; i++) {
        cutString = cutString + info.desc[i]
        if (ctx.measureText(cutString).width >= 456 - ellipsisWidth) {
          cutString = cutString + '...'
          ctx.fillText(cutString, 210, curHeight + 115)
          break
        }
      }
    } else {
      ctx.fillText(info.desc, 210, curHeight + 115)
    }
    

    // 画团队描述
    curHeight = curHeight + 131
    ctx.drawImage('../../../../../images/c1.png', 0, curHeight, 750, 174)
    curHeight = curHeight + 174
    ctx.drawImage('../../../../../images/c2.png', 0, curHeight, 750, 120)
    
    // 画职位标签
    let padding = 20
    curHeight = curHeight + 30
    let teamPosition = {
      x: 80,
      y: curHeight
    }
    ctx.setFontSize(24)
    info.teamLabel.map((item, index) => {
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
      if (index < info.teamLabel.length-1) {
        newLabelWidth = ctx.measureText(info.teamLabel[index+1].name).width + 2*padding
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
    for (let i = 0; i < info.positionDesc.length; i++) {
      descString = descString + info.positionDesc[i]
      descWidth = ctx.measureText(descString).width
      if (info.positionDesc[i] === '↵' || descWidth > (590)) {
        ctx.drawImage('../../../../../images/c2.png', 0, curHeight, 750, 48)
        ctx.fillText(descString.slice(0, descString.length-1), 80, curHeight)
        descString = ''
        curHeight += 48
      }
    }
    ctx.drawImage('../../../../../images/c4.png', 0, curHeight - 200, 74, 92)
    ctx.drawImage('../../../../../images/1547620956(1).jpg', 77, curHeight + 80, 167, 167)
    ctx.drawImage('../../../../../images/canvas5.png', 0, curHeight, 750, 287)
    ctx.setFontSize(30)
    ctx.setFillStyle('#fff')
    ctx.fillText('长按打开小程序与Ta约面吧！', 276, curHeight + 160)
    ctx.setFontSize(24)
    ctx.fillText('Ta还有产品、技术等10个职位在招！', 276, curHeight + 205)
    curHeight = curHeight + 287
    ctx.draw(true, () => {
      setTimeout(() => {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 750,
          height: curHeight,
          canvasId: 'canvas',
          success(res) {
            console.log(res.tempFilePath, 1111)
            that.setData({imgUrl: res.tempFilePath, imgH: curHeight})
          }
        })
      }, 300)
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
      console.log(this.data.userInfo, 2222222)
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