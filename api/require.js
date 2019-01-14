import {APPLICANTHOST, RECRUITERHOST, COMMON, RECRUITER, APPLICANT} from '../config.js'

let loadNum = 0
let addHttpHead = {}
let BASEHOST = ''
export const request = ({method = 'post', url, data = {}, needKey = true, hasLoading = true, loadingContent = '加载中...'}) => {
  if (!wx.getStorageSync('choseType') || wx.getStorageSync('choseType') === "APPLICANT") {
    BASEHOST = APPLICANTHOST
  } else {
    BASEHOST = RECRUITERHOST
  }
  if (wx.getStorageSync('sessionToken')) {
    addHttpHead['Authorization-Wechat'] = wx.getStorageSync('sessionToken')
  }
  if (wx.getStorageSync('token')) {
    addHttpHead['Authorization'] = wx.getStorageSync('token')
  }
  // 版本号， 每次上次发版 + 1
  addHttpHead['cv'] = 100
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
            // console.log(msg)
          } else {
            reject(msg)
            getApp().wxToast({title: msg.msg})
          }
          switch (msg.httpStatus) {
            case 200:
              break
            case 401:
              wx.removeStorageSync('token')
              // 需要用到token， 需要绑定手机号 但是需要先授权
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
            case 400:
              if (msg.code === 701 && url !== '/jobhunter/resume') {
                wx.navigateTo({
                  url: `${APPLICANT}center/createUser/createUser`
                })
              }
              if (msg.code === 801 && url !== '/recruiter/detail') {
                // 还没有创建公司
                if(Array.isArray(res.data.data)) {
                  wx.reLaunch({url: `${RECRUITER}user/company/apply/apply`})
                  return
                }
                // 是申请加入公司
                if(msg.data.applyJoin) {
                  wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=apply`})
                  return
                }
                // 已创建公司，但是还在审核状态或者审核失败
                if(!msg.data.applyJoin) {
                  wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=company`})
                  return;
                }
              }
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

