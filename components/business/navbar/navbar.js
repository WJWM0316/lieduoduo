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
    }
  },
  data: {
    showBackBtn: false,
    navH: app.globalData.navHeight,
    positionStatus: 'fixed'
  },
  attached() {
    let positionStatus = this.data.positionStatus
    if (!this.data.isFixed) {
      positionStatus = 'relative'
    }
    identity = wx.getStorageSync('choseType')
    if (getCurrentPages().length > 1) {
      this.setData({showBackBtn: true, positionStatus})
    } else {
      this.setData({positionStatus})
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
    }
  }
})