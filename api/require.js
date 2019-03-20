import {APPLICANTHOST, RECRUITERHOST, PUBAPIHOST, COMMON, RECRUITER, APPLICANT} from '../config.js'

let loadNum = 0
let BASEHOST = ''
let toAuth = false
let toBindPhone = false
export const request = ({method = 'post', url, host, data = {}, needKey = true, hasLoading = true, loadingContent = '加载中...'}) => {
  let addHttpHead = {}
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
  if (data.sCode) {
    addHttpHead['Act-Code'] = data.sCode
    addHttpHead['Act-Pid'] = data.id || data.uid
  } else {
    delete addHttpHead['Act-Code']
    delete addHttpHead['Act-Pid']
  }
  
  // 渠道统计
  if (data.sourceType) {
    addHttpHead['Channel-Code'] = data.sourceType
    addHttpHead['Channel-Url'] = data.sourcePath
  } else {
    delete addHttpHead['Channel-Code']
    delete addHttpHead['Channel-Url']
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
        console.log(url, res.data)
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
            reject(msg)
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

                if(msg.data.applyJoin) {
                  // 加入公司
                  wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=join`})
                } else {

                  if(!msg.data.companyInfo.id) {
                    // 还没有填写公司信息
                    wx.reLaunch({url: `${RECRUITER}user/company/apply/apply`})
                  } else {
                    
                    // 创建公司 没填身份证 但是公司已经审核通过
                    if(msg.data.companyInfo.status === 1 && !msg.data.id) {
                      wx.reLaunch({url: `${RECRUITER}user/company/identity/identity?from=identity`})
                      return;
                    }
                    // 创建公司 已填身份证 身份证没通过 公司已经审核通过
                    if(msg.data.companyInfo.status === 1 && msg.data.id && msg.data.status === 2) {
                      wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=identity`})
                      return;
                    }
                    wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=company`})
                  }
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

