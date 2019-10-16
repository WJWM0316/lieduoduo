const app = getApp()
let imgUrl = '',
    detail = ''
import {getWantYouApi} from '../../../../../api/pages/poster.js'
import {WEBVIEW} from '../../../../../config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',
    options: {},
    openSet: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({options})
    if (options.url) {
      let url = decodeURIComponent(options.url)
      this.setData({url})
      wx.getImageInfo({
        src: url,
        success(res) {
          imgUrl = res.path
        }
      })
    }
    if (options.from === 'wantYou') {
      wx.setStorageSync('choseType', 'APPLICANT')
      if (options.token && options.oauthCode) {        
        if (!app.globalData.hasLogin) {
          app.oauthCode(options)
        }
      }
      let params = options.uid ? {uid: options.uid} : {}
      getWantYouApi(params).then(res => {
        detail = res.data.detail
        this.setData({url: res.data.url})
      })
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
      if (that.data.options.from === 'wantYou') {
        var save = wx.getFileSystemManager();
        var number = Math.random();
        save.writeFile({
          filePath: wx.env.USER_DATA_PATH + '/pic' + number + '.png',
          data: that.data.url.slice(22),
          encoding: 'base64',
          success: res => {
            wx.saveImageToPhotosAlbum({
              filePath: wx.env.USER_DATA_PATH + '/pic' +number+'.png',
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
        })
      } else {
        wx.saveImageToPhotosAlbum({
          filePath: imgUrl,
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
  onShareAppMessage: function (options) {
    let title, p, path, imageUrl
    if (this.data.options.from === 'wantYou') {
      title = `我已加入公司内部招聘行列，就差你了~`
      p        = `${WEBVIEW}wantYou_b?vkey=sdfcxfe&uid=${detail.uid}`
      path  = `page/common/pages/webView/webView?type=1&p=${encodeURIComponent(p)}`
      imageUrl = 'https://attach.lieduoduo.ziwork.com/front-assets/wantYou/wantYouShareP1.jpg'
      app.shareStatistics({type: 'want_you_activity', id: 0, channel: 'card', sCode: 0})
    }
    return app.wxShare({
      options,
      title,
      imageUrl,
      path
    })
  }
})
