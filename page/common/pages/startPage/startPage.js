import {RECRUITER, APPLICANT} from '../../../../config.js'
const app = getApp()
Page({
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let choseType = wx.getStorageSync('choseType')
    switch(choseType) {
      case 'RECRUITER':
        wx.redirectTo({
          url: `${RECRUITER}index/index`
        })
        break
      case 'APPLICANT':
        wx.redirectTo({
          url: `${APPLICANT}index/index`
        })
        break
    }
  }
})