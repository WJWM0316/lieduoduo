import {ellipsis, lineFeed} from '../../../../../utils/canvas.js'
import {getPositionQrcodeApi} from '../../../../../api/pages/qrcode.js'
import {getRapidlyViweApi} from '../../../../../api/pages/poster.js'
let app = getApp()
let info = null
let avatarUrl = ''
let companyUrl = ''
let qrCodeUrl = '',
    curHeight = 0
let cWidth = 0,
    cHeight = 0,
    cX = 0,
    cY = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: '',
    imgW: 750,
    imgH: 0,
    openSet: true,
    timerSecond: 30000,
    guidePop: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getRapidlyViweApi().then(res => {
      this.setData({imgUrl: res.data.url})
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let guidePop = wx.getStorageSync('guidePop') || false
    this.setData({guidePop})
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
  hidePop (e) {
    this.setData({guidePop: true})
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
              if (res.errMsg.indexOf('fail') !== -1) {
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
      var save = wx.getFileSystemManager();
      var number = Math.random();
      save.writeFile({
        filePath: wx.env.USER_DATA_PATH + '/pic' + number + '.png',
        data: that.data.imgUrl.slice(22),
        encoding: 'base64',
        success: res => {
          wx.saveImageToPhotosAlbum({
            filePath: wx.env.USER_DATA_PATH + '/pic' +number+'.png',
            success: function (e) {
              app.wxToast({
                title: '已保存至相册',
                icon: 'success',
                callback () {
                }
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
  }
})