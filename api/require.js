import {APPLICANTHOST, RECRUITERHOST, PUBAPIHOST, COMMON, RECRUITER, APPLICANT} from '../config.js'

let loadNum = 0
let addHttpHead = {}
let BASEHOST = ''
let toAuth = false
let toBindPhone = false
export const request = ({method = 'post', url, host, data = {}, needKey = true, hasLoading = true, loadingContent = '加载中...'}) => {
  // baceHost 切换
  switch(host) {
    case 'PUBAPIHOST':
      BASEHOST = PUBAPIHOST
      break
    default:
      if (wx.getStorageSync('choseType') === "RECRUITER") {
        BASEHOST = RECRUITERHOST
      } else {
        BASEHOST = APPLICANTHOST
      }
  }

  // 如果连接带参数scode, 则存到头部
  if (data.scode) {
    addHttpHead['act_code'] = data.scode
    addHttpHead['act_pid'] = data.id || data.uid
    delete data.scode
  } else {
    delete addHttpHead['act_code']
    delete addHttpHead['act_pid']
  }
  
  // header 传递token, sessionToken
  if (wx.getStorageSync('sessionToken') && !wx.getStorageSync('token')) {
    addHttpHead['Authorization-Wechat'] = wx.getStorageSync('sessionToken')
  } else {
    delete addHttpHead['Authorization']
  }
  if (wx.getStorageSync('token')) {
    if (url !== '/bind/register' && url !== '/bind/quick_login') {
      addHttpHead['Authorization'] = wx.getStorageSync('token')
    } else {
      delete addHttpHead['Authorization']
    }
  } else {
    delete addHttpHead['Authorization']
  }

  // 请求中间件
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
        loadNum--
        if (loadNum <= 0) {
          wx.hideLoading()
          loadNum = 0
        }
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
          } else {
            if (msg.code !== 701 && msg.code !== 801) {
              getApp().wxToast({title: msg.msg, duration: 2000})
            }
            // reject(msg)
          }
          switch (msg.httpStatus) {
            case 200:
              break
            case 401:
              // 需要用到token， 需要绑定手机号
              if (msg.code === 4010) {
                if (toBindPhone) return
                toBindPhone = true
                let timer = setTimeout(() => {
                  toBindPhone = false
                  clearTimeout(timer)
                }, 3000)
                wx.removeStorageSync('token')
                wx.navigateTo({
                  url: `${COMMON}bindPhone/bindPhone`
                })
              }
              // 需要用到微信token， 需要授权
              if (msg.code === 0) {
                if (toAuth) return
                toAuth = true
                let timer = setTimeout(() => {
                  toAuth = false
                  clearTimeout(timer)
                }, 3000)
                wx.removeStorageSync('sessionToken')
                wx.removeStorageSync('token')
                if (url !== '/wechat/login/mini') {
                  wx.navigateTo({
                    url: `${COMMON}auth/auth`,
                    complete() {
                      wx.removeStorageSync('toAuth')
                    }
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
        loadNum--
        if (loadNum <= 0) {
          wx.hideLoading()
          loadNum = 0
        }
        console.log(e, 'wx.request发神经了')
      }
    })
  })
  return promise
}

