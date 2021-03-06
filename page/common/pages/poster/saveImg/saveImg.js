const app = getApp()
let imgUrl = '',
    detail = ''
import {getWantYouApi, getDelicateApi} from '../../../../../api/pages/poster.js'
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
  onLoad(options) {
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
		if (options.from === 'delicate') {
			wx.setStorageSync('choseType', 'APPLICANT')
			if (options.token && options.oauthCode) {        
			  if (!app.globalData.hasLogin) {
			    app.oauthCode(options)
			  }
			}
			let params = {vkey: options.vkey}
			getDelicateApi(params).then(res => {
			  this.setData({url: res.data.url})
			})
		}
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
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
      if (that.data.options.from === 'wantYou' || that.data.options.from === 'delicate') {
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
						app.wxReportAnalytics('btn_report', {
						  btn_type: 'save-activity-poster',
							title: that.data.options.from
						})
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    let title, path, imageUrl
    if (this.data.options.p) path  = `page/common/pages/webView/webView?p=${this.data.options.p}`
    if (this.data.options.t) title = decodeURIComponent(this.data.options.t)
    if (this.data.options.i) imageUrl = decodeURIComponent(this.data.options.i)
    if (this.data.options.statisticalType) app.shareStatistics({type: this.data.options.statisticalType, knacks: this.data.options.knacks, id: 0, channel: 'card', sCode: 0})
    return app.wxShare({
      options,
      title,
      imageUrl,
      path
    })
  }
})
