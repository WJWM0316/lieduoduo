import {WEBVIEW} from '../../../../config.js'
import { request } from '../../../../api/require.js'
import {checkSessionKeyApi} from '../../../../api/pages/auth.js'
const app = getApp()
let wxShare = {},
    query = {}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageUrl: '',
    cdnImagePath: app.globalData.cdnImagePath,
		h5Data: {},
    navH: app.globalData.navHeight
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 在此调用改接口只是为了触发request来设置sourceType，没有其它用途
    checkSessionKeyApi({session_token: wx.getStorageSync('sessionToken')})
    query = options.scene ? app.getSceneParams(options.scene) : options
  },
  onShow() {
    this.setData({pageUrl: ''}, () => {
      if (app.loginInit) {
        this.init(query)
      } else {
        app.loginInit = () => {
          this.init(query)
        }
      }
    })
  },
  init (options) {
    let pageUrl = ''
    let sessionToken = wx.getStorageSync('sessionToken')
    let token = wx.getStorageSync('token')
    app.readyStatistics('enterPage_report')
    switch (options.type) {
      case 'recruitmentDay':
        pageUrl = `${WEBVIEW}available?sessionToken=${sessionToken}&token=${token}`
        wxShare = {
          title: '顶级机构百亿资本加持，给你不容错过的职场新风口',
          path: '/page/common/pages/webView/webView?type=recruitmentDay',
          imageUrl: `${this.data.cdnImagePath}zpjShareBg_new.jpg`
        }
        app.readyStatistics({
          page: 'recruit_festival',
          channel: options.c || ''
        })
        break
      case 'userAgreement':
        pageUrl = `${WEBVIEW}userAgreement`
        break
      case 'wantYouC':
        app.readyStatistics('enterPage_report')
        pageUrl = `${WEBVIEW}wantYou?sessionToken=${sessionToken}&token=${token}`
        break
      case 'wantYouB':
        app.readyStatistics('enterPage_report')
        pageUrl = `${WEBVIEW}wantYou?type=bIndex&sessionToken=${sessionToken}&token=${token}`
        break
      case 'delicate':
        pageUrl =  `${WEBVIEW}delicate?vkey=${options.vkey}&sessionToken=${sessionToken}&token=${token}`
        wxShare = {
          title: '@精致的你，快来集合！3000+酷公司高薪机会正在找你',
          path: `/page/common/pages/webView/webView?type=delicate&vkey=${options.vkey}`,
          imageUrl: `https://attach.lieduoduo.ziwork.com/front-assets/delicate/delicateShare.jpg`
        }
        break
    }
    if (options.p) {
      let path = decodeURIComponent(options.p)
      if (options.t) {
        let title = decodeURIComponent(options.t),
            imgUrl = decodeURIComponent(options.i)
        wxShare = {
          title: title,
          path: app.getCurrentPagePath(),
          imageUrl: imgUrl
        }
      }
      if (path.indexOf('?') !== -1) {
        pageUrl = `${path}&sessionToken=${sessionToken}&token=${token}`
      } else {
        pageUrl = `${path}?sessionToken=${sessionToken}&token=${token}`
      }
    }
    console.log('h5链接', pageUrl)
    this.setData({pageUrl})
  },
  getMessage (e) {
    if (e.detail.data[0].vkey) {
      this.data.h5Data = e.detail.data[0]
    } else {
      wxShare = e.detail.data[0]
    }
    console.log(this.data.h5Data, 'h5返回的信息')
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wxShare = {}
    query = {}
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(options) {
		// 拼接转发人vkey
		if (wxShare.path.indexOf('vkey') !== -1) {
			let a = wxShare.path.split('=')
			a[a.length - 1] = this.data.h5Data.vkey
			wxShare.path = a.join('=')
		}
    return app.wxShare({
      options,
      ...wxShare
    })
  }
})