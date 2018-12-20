import {APPLICANTHOST, RECRUITERHOST, COMMON} from '../config.js'

let loadNum = 0
let addHttpHead = {}
if (wx.getStorageSync('sessionToken')) {
  addHttpHead['Authorization-Wechat'] = wx.getStorageSync('sessionToken')
}
if (wx.getStorageSync('token')) {
  addHttpHead['Authorization'] = wx.getStorageSync('token')
}
let BASEHOST = ''
export const request = ({method = 'post', url, data = {}, needKey = true, hasLoading = true, loadingContent = '加载中...'}) => {
  if (getApp().globalData.identity === 'APPLICAN') {
    BASEHOST = APPLICANTHOST
  } else {
    BASEHOST = RECRUITERHOST
  }
  const promise = new Promise((resolve, reject) => {
    // 开启菊花图
    if (hasLoading) {
      if (loadNum === 0) {
        wx.showLoading({
          title: loadingContent,
          mask: true
        })
      }
      loadNum++
    }
    wx.request({
      url: BASEHOST+url,
      header: addHttpHead,
      data: data,
      method: method,
      success(res) {
        if (typeof res.data === 'string') { // 转换返回json
          res.data = JSON.parse(res.data)
        }
        if (res) {
          let msg = res.data
          //有字符串的情况下 转数字
          msg.httpStatus = parseInt(msg.httpStatus)
          if (msg.httpStatus === 200) {
            resolve(msg)
            console.log(msg)
          } else {
            reject(msg)
            console.log(msg)
          }
          switch (msg.httpStatus) {
            case 200:
              break
            case 401:
              wx.removeStorageSync('token')
              // 需要用到token， 需要绑定手机号
              if (msg.code === 901) {
                wx.navigateTo({
                  url: `${COMMON}bindPhone/bindPhone`
                })
              }
              // 需要用到微信token， 需要授权
              if (msg.code === 902) {
                wx.navigateTo({
                  url: `${COMMON}auth/auth`
                })
              }
              break
          }
        }
      },
      fail(e) {
        console.log(e, 'wx.request发神经了')
      },
      complete() {
        loadNum--
        if (loadNum === 0) {
          wx.hideLoading()
        }
      }
    })
  })
  return promise
}

