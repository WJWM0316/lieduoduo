import {APPLICANTHOST, RECRUITERHOST, PUBAPIHOST, NODEHOST, COMMON, RECRUITER, APPLICANT, VERSION} from '../config.js'

let loadNum = 0
let BASEHOST = ''
let noToastUrlArray = [
  '/company/edit_first_step/',
  '/company/notifyadmin',
  '/company/edit_first_step',
  '/company/self_help_verification'
]
let apiVersionList = null
let toAuth = false,
    toBindPhone = false
let recruiterJump = (msg) => {
  let companyInfo = msg.data.companyInfo
  let identityInfo = msg.data
  // let applyJoin = msg.data.applyJoin
  if(Reflect.has(msg.data, 'applyJoin') && msg.data.applyJoin) {
    // 加入公司
    wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=join`})
  } else {
    // 还没有创建公司信息
    if(!Reflect.has(companyInfo, 'id')) {
      wx.reLaunch({url: `${RECRUITER}user/company/apply/apply`})
    } else {
      if(companyInfo.status === 1) {
        wx.reLaunch({url: `${RECRUITER}index/index`})
      } else {
        if(companyInfo.status === 3) {
          wx.reLaunch({url: `${RECRUITER}user/company/createdCompanyInfos/createdCompanyInfos`})
        } else {
          wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=company`})
        }
      }
    }
  }
}
let addHttpHead = {
  'Channel-Code': 'sch'
}
export const request = ({name = '', method = 'post', url, host, data = {}, needKey = true, hasLoading = true, loadingContent = '加载中...'}) => {
  // baceHost 切换
  switch(host) {
    case 'PUBAPIHOST':
      BASEHOST = PUBAPIHOST
      break
    case 'NODEHOST':
      BASEHOST = NODEHOST
      break
    default:
      if (wx.getStorageSync('choseType') === "RECRUITER") {
        BASEHOST = RECRUITERHOST
      } else {
        BASEHOST = APPLICANTHOST
      }
  }
  // 版本号
  addHttpHead['Wechat-Version'] = VERSION
  // 头参数
  addHttpHead['Role'] = wx.getStorageSync('choseType') !== "RECRUITER" ? 'j' : 'r'
  addHttpHead['Source'] = wx.getStorageSync('choseType') !== "RECRUITER" ? 'mini_c' : 'mini_b'
  // h5活动参数
	if (data.from === 'h5Activity') {
		addHttpHead['Exquisite-Code'] = data.vkey
	}
	
  // 如果连接带参数scode, 则存到头部
  if (data.sCode && !data.isReload) {
    addHttpHead['Act-Code'] = data.sCode
    addHttpHead['Act-Pid'] = data.id || data.uid
  } else {
    delete addHttpHead['Act-Code']
    delete addHttpHead['Act-Pid']
  }

  // msg_id
  let lastOne = getCurrentPages().length - 1
  let curRouteOptions = getCurrentPages()[lastOne] && getCurrentPages()[lastOne].options || {}
  if (curRouteOptions.hasOwnProperty('msg_id')) {
    addHttpHead['Msg-Id'] = curRouteOptions.msg_id
  } else {
    delete addHttpHead['Msg']
  }

  // 渠道统计
  if (curRouteOptions.hasOwnProperty('sourceType')) addHttpHead['Channel-Code'] = curRouteOptions.sourceType
  if (curRouteOptions.hasOwnProperty('sourcePath')) addHttpHead['Channel-Url'] = curRouteOptions.sourcePath

	delete data['from']
  delete data['sCode']
  delete data['isReload']


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
  if (wx.getStorageSync('sessionToken')) {
    if (url === '/bind/register' || url === '/bind/quick_login') {
      addHttpHead['Authorization-Wechat'] = wx.getStorageSync('sessionToken')
    }
  }

  // 请求中间件
  const promise = new Promise((resolve, reject) => {
    let saveApiData = {}
    // if (name) {
    //   if (!apiVersionList && wx.getStorageSync('apiVersionList')) {
    //     apiVersionList = wx.getStorageSync('apiVersionList')
    //   }
    //   saveApiData = wx.getStorageSync('saveApiData') || {}
    //   if (apiVersionList[name] && saveApiData[name] && apiVersionList[name].version === saveApiData[name].version) {
    //     resolve(saveApiData[name].data)
    //     return
    //   }
    // }
    // 开启菊花图
    if (data.hasOwnProperty('hasLoading')) {
      hasLoading = data.hasLoading
      delete data.hasLoading
    }
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
        try {
          if (typeof res.data === 'string') { // 转换返回json
            res.data = JSON.parse(res.data)
          }
          if (res) {
            let msg = res.data
            let showToast = true
            //有字符串的情况下 转数字
            msg.httpStatus = parseInt(msg.httpStatus)
            if (msg.httpStatus === 200) {
              resolve(msg)
            } else {
              if (msg.httpStatus !== 401 && msg.code !== 701 && msg.code !== 801 && msg.code !== 910 && msg.code !== 911 && !noToastUrlArray.some(now => url.includes(now))) {
                getApp().wxToast({title: msg.msg})
              }
              reject(msg)
            }
            switch (msg.httpStatus) {
              case 200:
                break
              case 401:
                // 需要用到token， 需要绑定手机号
                if (msg.code === 4010 && url !== '/reddot/top_bar_info' && url !== '/jobhunter/myInfo') {
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
                if (msg.code === 0 && url !== '/reddot/top_bar_info') {
                  if (toAuth) return
                  toAuth = true
                  let timer = setTimeout(() => {
                    toAuth = false
                    clearTimeout(timer)
                  }, 3000)
                  wx.removeStorageSync('sessionToken')
                  wx.removeStorageSync('token')
                  getApp().login().then(res => {
                    wx.redirectTo({
                      url: getApp().getCurrentPagePath()
                    })
                  })
                }
                break
              case 400:
                if (msg.code === 703) {
                  wx.reLaunch({
                    url: `${APPLICANT}createUser/createUser?micro=true`
                  })
                }
                if (msg.code === 801) {
                  recruiterJump(msg)
                }
                break
              case 500:
                getApp().wxToast({title: '服务器异常，请稍后访问'})
                break
            }
          }
        } catch (e) {
          getApp().wxToast({title: '服务器异常，请稍后访问'})
        }
      },
      fail(e) {
        loadNum--
        if (loadNum <= 0) {
          wx.hideLoading()
          loadNum = 0
        }
        getApp().wxToast({title: '服务器异常，请稍后访问'})
      }
    })
  })
  return promise
}

