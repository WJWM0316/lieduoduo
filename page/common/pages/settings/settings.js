import {uploginApi} from "../../../../api/pages/auth.js"
import {COMMON,RECRUITER,APPLICANT} from '../../../../config.js'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    identity: "面试官"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (wx.getStorageSync('choseType') === 'RECRUITER') {
      this.setData({identity: "求职者"})
    } else {
      this.setData({identity: "面试官"})
    }
  },
  upLogin() {
    app.wxConfirm({
      title: '退出登录',
      content: `确定退出当前账号吗？`,
      confirmBack() {
        app.uplogin()
      }
    })
  },
  changeMobile() {
    wx.navigateTo({
      url: `${COMMON}changeMobile/changeMobile`
    })
  },
  toggleIdentity() {
    app.wxConfirm({
      title: '身份切换',
      content: `是否切换为${this.data.identity}身份`,
      confirmBack() {
        app.toggleIdentity()
      }
    })
  }
})