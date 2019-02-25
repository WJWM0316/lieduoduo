import {APPLICANTHOST, RECRUITERHOST, COMMON, RECRUITER, APPLICANT} from '../config.js'

let loadNum = 0
let addHttpHead = {}
let BASEHOST = ''

export const request = ({method = 'post', url, data = {}, needKey = true, hasLoading = true, loadingContent = '加载中...'}) => {
  if (wx.getStorageSync('choseType') === "RECRUITER") {
    BASEHOST = RECRUITERHOST
  } else {
    BASEHOST = APPLICANTHOST
  }
  if (wx.getStorageSync('sessionToken') && !wx.getStorageSync('token')) {
    addHttpHead['Authorization-Wechat'] = wx.getStorageSync('sessionToken')
  } else {
    addHttpHead['Authorization-Wechat'] = ''
  }
  if (wx.getStorageSync('token')) {
    if (url !== '/bind/register' && url !== '/bind/quick_login') {
      addHttpHead['Authorization'] = wx.getStorageSync('token')
    } else {
      addHttpHead['Authorization'] = ''
    }
  }  else {
    addHttpHead['Authorization'] = ''
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
        console.log(url, res)
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
            if (msg.code !== 701 && msg.code !== 801) {
              getApp().wxToast({title: msg.msg})
            }
          }
          switch (msg.httpStatus) {
            case 200:
              break
            case 401:
              wx.removeStorageSync('token')
              // 需要用到token， 需要绑定手机号
              if (msg.code === 4010) {
                wx.navigateTo({
                  url: `${COMMON}bindPhone/bindPhone`
                })
              }
              // 需要用到微信token， 需要授权
              if (msg.code === 0) {
                if (url !== '/wechat/login/mini') {
                  wx.navigateTo({
                    url: `${COMMON}auth/auth`
                  })
                }
              }
              break
            case 400:
              if (msg.code === 701 && url !== '/jobhunter/cur/resume') {
                wx.navigateTo({
                  url: `${APPLICANT}center/createUser/createUser`
                })
              }
              if (msg.code === 801) {
                wx.setStorageSync('companyInfos', res.data)
                // 还没有创建公司
                if(!res.data.data.companyInfo.vkey) {
                  wx.reLaunch({url: `${RECRUITER}user/company/apply/apply`})
                  return
                }
                // 创建公司，但是还在审核状态或者审核失败
                if(!msg.data.applyJoin && res.data.data.companyInfo.status !== 1) {
                  wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=company`})
                  return;
                }
                // 创建公司，但是个人身份还在认证
                if(!msg.data.applyJoin && msg.data.status !== 1) {
                  wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=identity`})
                  return;
                }
                // 是申请加入公司 并且个人身份还在认证
                if(msg.data.applyJoin && msg.data.status !== 1) {
                  wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=apply`})
                  return
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
        if (loadNum <= 0) {
          wx.hideLoading()
          loadNum = 0
        }
      }
    })
  })
  return promise
}

