// components/business/choose/choose.js
import {RECRUITER, APPLICANT, COMMON} from '../../../config.js'
let identity = 'APPLICANT'
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    looked: true,
    isChose: false,
    showRule: false,
    cdnImagePath: getApp().globalData.cdnImagePath
  },
  attached: function () {
    wx.login({
      success: function (res0) {
        wx.setStorageSync('code', res0.code)
      }
    })

    let choseType = wx.getStorageSync('choseType') || null
    if (choseType) {
      this.setData({
        isChose: true
      })
    }


  },
  /**
   * 组件的方法列表
   */
  methods: {
    formSubmit(e) {
      app.postFormId(e.detail.formId)
    },
    look () {
      let looked = this.data.looked
      this.setData({looked: !looked})
    },
    bindPhone () {
      if (!this.data.looked) {
        app.wxToast({title: '请先阅读并同意《猎多多用户协议》'})
        return
      }
      wx.setStorageSync('choseType', 'RECRUITER')
      wx.navigateTo({url: `${COMMON}bindPhone/bindPhone?backType=bIndex`})
      this.setData({showRule: false})
    },
    close () {
      this.setData({showRule: false})
    },
    toRule () {
      wx.navigateTo({url: `${COMMON}webView/webView?type=userAgreement`})
      wx.removeStorageSync('choseType')
    },
    jump(e) {
      let url = ''
      if (e.currentTarget.dataset.identity === 'APPLICANT') {
        identity = 'APPLICANT'
        url = `${APPLICANT}index/index`
      } else {
        identity = 'RECRUITER'
        url = `${RECRUITER}index/index`
      }
      wx.setStorageSync('choseType', identity)

      if (app.globalData.hasLogin) {
        app.getAllInfo().then(res => {
          this.setData({isChose: true})
          wx.reLaunch({url})
        }).catch(e => {
          this.setData({isChose: true})
          wx.reLaunch({url})
        })
      } else {
        if (!this.data.showRule && identity === 'RECRUITER') {
          this.setData({showRule: true})
          return
        }
        wx.reLaunch({url})
      }
    }
  }
})
