import config from '../config.js'

/* eslint-disable no-undef */
const util = {
  loading: (isLoading, content) => {
    if (isLoading) {
      wx.showLoading({
        title: content || '加载中...',
        mask: true
      })
    }
  },
  unloading: (isLoading) => {
    if (isLoading) {
      wx.hideLoading()
    }
  }
}

export const request = ({ method = 'post', url, data = {}, needKey = true, isLoading = true, needUserInfo = true } = {}) => {
  isLoading = data.isLoading || isLoading
  if (data.isLoading !== undefined) {
    delete data.isLoading
  }
  const promise = new Promise((resolve, reject) => {
    const error = {
      code: 500,
      message: '网络不可用，请检查网络设置。'
    }
    util.loading(isLoading)
    const addHttpHead = {
      token: wx.getStorageSync('token') || '',
      cv: 109
    }
    wx.request({
      url: config.baseHost+url,
      header: addHttpHead,
      data: data,
      method: method,
      success(res) {
        util.unloading(isLoading)
        if (typeof res.data === 'string') { // 转换返回json
          res.data = JSON.parse(res.data)
        }
        if (res) {
          let msg = res.data
          //有字符串的情况下 转数字
          msg.http_status = parseInt(msg.http_status)
          switch (msg.http_status) {
            case 200:
              // 接口请求成功
              util.unloading(isLoading)
              resolve(msg)
              break
            case 401:
              // 未登录 跳去首页
              wx.reLaunch({
                url: `/pages/index/main`
              })
              util.unloading(isLoading)
              resolve(msg)
              wx.removeStorageSync('token')
              break
            case 500:
              util.unloading(isLoading)
              wx.showToast({
                title: '服务器异常，请稍后再试',
                icon: 'none',
                duration: 2000
              })
              break
            default:
              util.unloading(isLoading)
              reject(msg)
          }
        }
      },
      fail(res) {
        console.error('fail',url, res);
        if(!wx.getStorageSync('noNetwork')) {
          wx.setStorageSync('noNetwork', true)
          wx.navigateTo({
            url: '/pages/brokenNet/main'
          })
        }
        util.unloading(isLoading)
        reject(res);
      },
    });
  })
  return promise
}


// 上传微信文件到服务器
export const upload = ({ url, filePath, data = {}, setting = {}, isLoading = false } = {}) => {
  return new Promise((resolve, reject) => {
    if (url.indexOf('http') === -1) {
      url = config.baseHost + url
    }
    util.loading(isLoading, '上传中...')
    const uploadTask = wx.uploadFile({
      url: url,
      filePath: filePath,
      name: setting.name || 'file',
      formData: data,
      header: setting.header || {},
      success: res => {
        console.log('上传文件接口返回：', res)
        try {
          let resData = res.data

          if (typeof resData === 'string') { // 转换返回json
            resData = JSON.parse(resData || '{}')
          }

          if (resData) {
            switch (resData.statusCode) {
              case 200:
                // 接口请求成功
                resolve(resData.data === undefined ? {} : resData.data)
                break
              default:
                reject(resData)
            }
          }
        } catch (error) {
          console.log('服务器错误：', res)
          console.log('catch到的错误信息', error)
          const e = { message: '网络连接异常，请重试' }
          reject(e)
        }
      },
      fail: res => {
        reject(res)
      },
      complete: res => {
        util.unloading(isLoading)
      }
    })

    if (setting.onTaskInit && setting.onTaskInit instanceof Function) {
      setting.onTaskInit(uploadTask)
    }

    if (setting.onProgress && setting.onProgress instanceof Function) {
      uploadTask.onProgressUpdate((res) => {
        setting.onProgress(res)
        // // console.log('上传进度', res.progress)
        // // console.log('已经上传的数据长度', res.totalBytesSent)
        // // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
      })
    }
  })
}


/**
 * 获取session_key
 */
export function getSessionKey ({ isLoading = false } = {}) {
  return new Promise((resolve, reject) => {
    // 调用微信登录获取本地session_key
    wx.login({
      success: function (res) {
        // console.log('rquire login')
        // 请求接口获取服务器session_key
        const getSessionKeyParams = {
          url: '/wx/my/getSessionKey',
          data: {
            code: res.code
          },
          needKey: false,
          isLoading: isLoading
        }
        request(getSessionKeyParams).then(res => {
          // console.log('require:获取sessionkey成功并存入本地缓存', res.key)
          wx.setStorageSync('session_key', res.key)
          resolve(res)
        }).catch(e => {
          // console.log('rquire: 严重错误：code换session失败，错误码400', e.message)
          reject(e)
        })
      }
    })
  })
}


/**
 * 获取用户信息
 * @param {*} key
 */
export function getUserInfo ({ key, isLoading = false } = {}) {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      withCredentials: true, // 是否带上登录态信息，true时必须已经wx.login后
      success: function (res) {
        console.log('用户同意微信授权', res)
        // 这里不取微信返回的用户信息，而是将加密后的用户信息请求后端，后端将用户信息入库，再返回的整理后的给前端。
        // console.log('微信userInfo换自己服务的userInfo,', res)
        const data = {
          encryptedData: res.encryptedData,
          iv: res.iv
        }
        // 如果有key
        if (key) {
          data.key = key
        }
        const grantInformationParams = {
          url: '/wx/my/grantInformation',
          data: data,
          isLoading: isLoading,
          needUserInfo: false
        }
        request(grantInformationParams).then(resp => {
          console.log('获取用户授权成功并交换userinfo成功', resp)
          resolve(resp)
        }).catch(e => {
          // 捕获 grantInformationApi 异常
          // console.log('捕获 grantInformationApi', e)
          reject(e)
        })
      },
      fail: function (res) {
        console.log('用户拒绝微信授权 微信getUserInfo 失败', res)
        reject(res)
      }
    })
  })
}
