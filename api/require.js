import {baseHost} from '../config.js'

let loadNum = 0
export const request = ({method = 'post', url, data = {}, needKey = true, hasLoading = true, loadingContent = '加载中...'}) => {
  const promise = new Promise((resolve, reject) => {
    const addHttpHead = {
      'Authorization': wx.getStorageSync('token')
    }
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
      url: baseHost+url,
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

