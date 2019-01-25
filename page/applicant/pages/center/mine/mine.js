import {COMMON,APPLICANT,RECRUITER} from '../../../../../config.js'
import { getPersonalResumeApi } from '../../../../../api/pages/center.js'

let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myInfo: {},
    hasLogin: false,
    hideBind: true,
    hasReFresh: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    let hasLogin = app.globalData.hasLogin
    if (app.globalData.resumeInfo.uid) {
      let myInfo = app.globalData.resumeInfo
      let isComplete = this.data.isComplete
      this.setData({myInfo, hasLogin})
    } else {
      app.pageInit = () => {
        let myInfo = app.globalData.resumeInfo
        let isComplete = this.data.isComplete
        this.setData({myInfo, hasLogin})
      }
    }
  },
  online() {
    app.wxConfirm({
      title: '联系客服',
      content: '欢迎添加猎多多了解更多内容 有疑问请添加客服微信：zhubin96',
      confirmText: '复制',
      confirmBack() {
        wx.setClipboardData({
          data: 'zhubin96',
          success(res) {
            wx.getClipboardData({
              success(res) {
                app.wxToast({
                  title: '复制成功',
                  icon: 'success'
                })
              }
            })
          }
        })
      }
    })
  },
  onHide() {
    this.setData({hideBind: true})
  },
  login() {
    this.setData({hideBind: false})
  },
  preview() {
    // wx.downloadFile({
    //   url: 'https://lieduoduo-uploads-test.oss-cn-shenzhen.aliyuncs.com/front-assets/file/111.pdf',
    //   success(res) {
    //     const filePath = res.tempFilePath
    //     wx.openDocument({
    //       filePath,
    //       success(res) {
    //         console.log('打开文档成功')
    //       }
    //     })
    //   },
    //   fail(e) {
    //     console.log(e)
    //   }
    // })
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        console.log(res)
      }
    })
  },
  jump(e) {
    switch(e.currentTarget.dataset.type) {
      case "settings":
        wx.navigateTo({
          url: `${COMMON}settings/settings`
        })
        break
      case "poster":
        wx.navigateTo({
          url: `${COMMON}poster/resume/resume`
        })
        break
    }
  },
  /* 去完善简历 */
  completeResume () {
    wx.navigateTo({
      url: `${APPLICANT}center/createUser/createUser`
    })
  },
  /* 编辑简历 */
  toEdit () {
    wx.navigateTo({
      url: `${COMMON}resumeDetail/resumeDetail`,
    })
  },
  onPullDownRefresh(hasLoading = true) {
    this.setData({hasReFresh: true})
    getPersonalResumeApi().then(res => {
      app.globalData.resumeInfo = res.data
      wx.stopPullDownRefresh()
      this.setData({hasReFresh: false})
    })
  }
})