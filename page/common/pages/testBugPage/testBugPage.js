import {APPLICANT, RECRUITER} from '../../../../config.js'
let token = ''
Page({
  bindblur (e) {
    token = e.detail.value
  },
  setToken () {
    wx.setStorageSync('token', token)
    if (wx.getStorageSync('choseType') !== 'RECRUITER') {
      wx.reLaunch({url: `${APPLICANT}index/index`})
    } else {
      wx.reLaunch({url: `${RECRUITER}index/index`})
    }
  },
  ceshi () {
    wx.chooseMessageFile({
      count: 2,
      success: (res) => {
        console.log(res)
      }
    })
  }
})