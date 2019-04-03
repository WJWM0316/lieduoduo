import {APPLICANT,RECRUITER} from "../../../config.js"
const app = getApp()
let identity = ''
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    title: {
      type: String,
      value: '猎多多'
    },
    showNav: {
      type: Boolean,
      value:true
    },
    showBack: {
      type: Boolean,
      value: true
    },
    showHome: {
      type: Boolean,
      value: false
    },
    background: {
      type: String,
      value: '#652791'
    },
    color: {
      type: String,
      value: '#fff'
    },
    customBack: {
      type: Boolean,
      value: false
    },
    isFixed: {
      type: Boolean,
      value: true
    },
    showScanIcon: {
      type: Boolean,
      value: false
    }
  },
  data: {
    showBackBtn: false,
    navH: app.globalData.navHeight,
    positionStatus: 'fixed',
    cdnImagePath: app.globalData.cdnImagePath,
    firstClick: true,
    showScanBox: false
  },
  attached() {
    let positionStatus = this.data.positionStatus
    let firstClick = wx.getStorageSync('firstClick')

    if (!this.data.isFixed) {
      positionStatus = 'relative'
    }
    
    identity = wx.getStorageSync('choseType')
    let route = getCurrentPages()
    if (route.length > 1) {
      this.setData({showBackBtn: true, positionStatus})
    } else {
      this.setData({positionStatus})
    }
    if(firstClick) {
      this.setData({firstClick: false})
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //回退
    navBack() {
      if (this.data.customBack) {
        this.triggerEvent('backEvent')
      } else {
        wx.navigateBack({delta: 1})
      }
    },
    // 回到首页
    backHome() {
      if (identity === 'RECRUITER') {
        wx.reLaunch({
          url: `${RECRUITER}index/index`
        })
      } else {
        wx.reLaunch({
          url: `${APPLICANT}index/index`
        })
      }
    },
    formSubmit(e) {
      app.postFormId(e.detail.formId)
    },
    closeTips() {
      this.setData({firstClick: false}, () => wx.setStorageSync('firstClick', 1))
    },
    showScan() {
      this.setData({showScanBox: true})
    }
  }
})