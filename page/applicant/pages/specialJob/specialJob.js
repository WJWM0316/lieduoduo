import {getRapidlyApi, getRecentApi} from '../../../../api/pages/specialJob.js'
import {getSelectorQuery} from '../../../../utils/util.js'
import {touchApi} from '../../../../api/pages/common.js'
import {COMMON, APPLICANT} from '../../../../config.js'
const app = getApp() 
let tabTop = 0,
    hasOnload = false,
    timer = null,
    navTimer = null,
    jumpTimer = null,
    avatarsNum = 10
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: app.globalData.navHeight,
    cdnImagePath: app.globalData.cdnImagePath,
    isJobhunter: app.globalData.isJobhunter,
    isIphoneX: app.globalData.isIphoneX,
    timeList: [],
    hasReFresh: false,
    hideLoginBox: true,
    nowListData: {
      list: [],
      count: app.globalData.pageCount,
      pageNum: 0,
      isLastPage: false,
      isRequire: false
    },
    oldListData: {
      list: [],
      count: app.globalData.pageCount,
      pageNum: 0,
      onBottomStatus: 0,
      isLastPage: false,
      isRequire: false
    },
    otherData: {
      buttons: [],
      joinUserAvatars: [],
      joinUserTotal: 0,
      onBottomStatus: 0,
      toastTips: [],
      isRequire: false
    },
    tabIndex: 0,
    tabFixed: false,
    navFixed: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    hasOnload = false
    if (app.loginInit) {
      this.getRapidly()
      hasOnload = true
      this.init()
    } else {
      app.loginInit = () => {
        this.getRapidly()
        hasOnload = true
        this.init()
      }
    }
  },
  onShow: function () {
    if (hasOnload) this.init()
    // 强制切换身份
    if (wx.getStorageSync('choseType') !== 'APPLICANT') wx.setStorageSync('choseType', 'APPLICANT')
    // 更新数据
    if (wx.getStorageSync('chatSuccess') && this.data.nowListData.list.length > 0) {
      let chatSuccess = wx.getStorageSync('chatSuccess')
      for (var i = 0; i < this.data.nowListData.list.length; i++) {
        for (var j = 0; j < this.data.nowListData.list[i].length; j++) {
          if (this.data.nowListData.list[i][j].id === chatSuccess.id) {
            let applyNum = this.data.nowListData.list[i][j].applyNum
            applyNum++
            this.setData({[`nowListData.list[${i}][${j}].applyNum`]: applyNum}, () => {
              wx.removeStorageSync('chatSuccess')
            })
            return
          }
        }
      }
    }
  },
  init () {
    if (!app.globalData.hasLogin) {
      this.setData({hideLoginBox: false})
    } else {
      if (app.getRoleInit) {
        this.setData({isJobhunter: app.globalData.isJobhunter})
        if(!app.globalData.isMicroCard) this.initPage()
      } else {
        app.getRoleInit = () => {
          this.setData({isJobhunter: app.globalData.isJobhunter})
          if(!app.globalData.isMicroCard) this.initPage()
        }
      }
    }
  },
  avatarsChange () {
    let avaTimer = null,
        list = this.data.otherData.joinUserAvatars
    clearTimeout(avaTimer)
    avatarsNum--
    avaTimer = setTimeout(() => {
      list.unshift(list[list.length - 1])
      list.splice(list.length - 1, 1)
      this.setData({['otherData.joinUserAvatars']: list}, () => {
        if (avatarsNum < 0) return
        this.avatarsChange()
      })
    }, 3000)
  },
  dealTime (page) {
    let list = this.data.nowListData.list[page -1],
        timeList = []
    list.forEach((item) => {
      timeList.push({
        day: item.day,
        hour: item.hour,
        minute: item.minute,
        second: item.second
      })
    })
    this.setData({[`timeList[${page -1}]`]: timeList}, () => {
      this.countDown()
    })
  },
  countDown () {
    clearInterval(timer)
    timer = setTimeout(() => {
      let timeList = this.data.timeList,
          nowListData = this.data.nowListData
      timeList.forEach((list, listIndex) => {
        list.forEach((item, itemIndex) => {
          let day = parseInt(item.day),
              hour = parseInt(item.hour),
              minute = parseInt(item.minute),
              second = parseInt(item.second)
          if (second || minute || hour || day) {
            second--
            if ((day || hour || minute) && second < 0) {
              second = 60
              minute--
              if ((day || hour) && minute < 0) {
                minute = 59
                hour--
                if (day && hour < 0) {
                  hour = 23
                  day--
                  if (day < 0) day = 0
                }
              }
            }
            this.countDown()
          }

          if (!second && !minute && !hour && !day) {
            let oldListData = this.data.oldListData
            if (oldListData.isRequire) {
              if (!oldListData.list[0]) oldListData.list[0] = []
              oldListData.list[0].unshift(nowListData.list[listIndex][itemIndex])
              this.setData({['oldListData.list[0]']: oldListData.list[0]})
            }
            timeList[listIndex].splice(itemIndex, 1) // 删除改项
            nowListData.list[listIndex].splice(itemIndex, 1) // 删除改项
            this.setData({
              [`nowListData.list[${listIndex}]`]: nowListData.list[listIndex], 
              [`timeList[${listIndex}]`]: timeList[listIndex]
            })
          }
          item.day = day
          item.hour = hour >= 10 ? hour : '0' + hour
          item.minute = minute >= 10 ? minute : '0' + minute
          item.second = second >= 10 ? second : '0' + second
        })
      })
      this.setData({timeList})
    }, 1000)
  },
  touchVkey (e) {
    if (!e.currentTarget.dataset.btntype) return
    let vkey = e.currentTarget.dataset.btntype === 1 ? this.data.otherData.buttons[0].vkey : this.data.otherData.buttons[1].vkey
    touchApi({vkey})
  },
  routeJump (e) {
    let touch = e.currentTarget.dataset
    switch (touch.route) {
      case 'positionDetail': 
        wx.navigateTo({
          url: `${COMMON}positionDetail/positionDetail?positionId=${touch.id}`
        })
        break
      case 'strategy':
        wx.navigateTo({
          url: `${APPLICANT}strategy/strategy`
        })
        wx.setStorageSync('strategyData', this.data.otherData.toastTips)
        this.touchVkey(e)
        break
      case 'createUser':
        wx.navigateTo({
          url: `${APPLICANT}createUser/createUser?from=specialJob`
        })
        this.touchVkey(e)
        break
      case 'toggleTab':
        this.toggleTab(e)
        wx.pageScrollTo({scrollTop: tabTop})
        break
      case 'index':
        wx.reLaunch({
          url: `${APPLICANT}index/index`
        })
        break
      default:
        this.touchVkey(e)
    }
  },
  onReady: function () {
    wx.nextTick(() => {
      getSelectorQuery('.tab').then(res => {
        tabTop = res.top
      })
    })
  },
  initPage () {
    clearTimeout(jumpTimer)
    let jumpCreate = () => {
      app.wxToast({
        title: '前往求职飞船',
        icon: 'loading',
        callback () {
          wx.reLaunch({
            url: `${APPLICANT}createUser/createUser?micro=true&type=specialJob`
          })
        }
      })
    }
    jumpCreate()
  },
  getRapidly (hasLoading = true) {
    let tabIndex = this.data.tabIndex,
        listData = !tabIndex ? this.data.nowListData : this.data.oldListData,
        listType = !tabIndex ? 'nowListData' : 'oldListData',
        listFun = !tabIndex ? getRapidlyApi : getRecentApi,
        params = {
          page: listData.pageNum,
          count: listData.count,
          hasLoading
        } 
    params.page++
    return listFun(params).then(res => {
      let list = !tabIndex ? res.data.items : res.data,
          isLastPage = listData.isLastPage,
          onBottomStatus = listData.onBottomStatus
      if (!listData.isLastPage && res.meta && !res.meta.nextPageUrl) isLastPage = true
      this.setData({
        [`${listType}.list[${params.page - 1}]`]: list,
        [`${listType}.pageNum`]: params.page
      }, () => {
        if (!tabIndex) this.dealTime(listData.pageNum)
        if (!listData.isRequire || isLastPage) {
          this.setData({
            [`${listType}.isRequire`]: true,
            [`${listType}.isLastPage`]: isLastPage,
            [`${listType}.onBottomStatus`]: isLastPage ? 2 : 0
          })
        }
        if (!this.data.otherData.isRequire && !tabIndex) {
          let otherData = res.data
          delete otherData.items
          this.setData({otherData}, () => {
            // this.avatarsChange()
          })
        }
      })
    })
  },
  toggleTab (e) {
    wx.pageScrollTo({scrollTop: 0})
    let tabIndex = e.currentTarget.dataset.index
    this.setData({tabIndex}, () => {
      let listData = !tabIndex ? this.data.nowListData : this.data.oldListData
      if (!listData.isRequire) this.getRapidly()
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(timer)
  },
  onPageScroll(e) {
    clearTimeout(navTimer)
    navTimer = setTimeout(() => {
      if (e.scrollTop > 0) {
        if (!this.data.navFixed) this.setData({navFixed: true})
      } else {
        if (this.data.navFixed) this.setData({navFixed: false})
      }
      if (e.scrollTop > tabTop) {
       if (!this.data.tabFixed) this.setData({tabFixed: true})
      } else {
        if (this.data.tabFixed) this.setData({tabFixed: false})
      }
      clearTimeout(navTimer)
    }, 10)
  },
  formSubmit(e) {
    app.postFormId(e.detail.formId)
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let tabIndex = this.data.tabIndex,
        listData = !tabIndex ? this.data.nowListData : this.data.oldListData,
        listType = !tabIndex ? 'nowListData' : 'oldListData',
        defaultData = {
          list: [],
          count: app.globalData.pageCount,
          pageNum: 0,
          onBottomStatus: 0,
          isLastPage: false,
          isRequire: false
        }
    this.setData({
      [`${listType}`]: {
          list: [],
          count: app.globalData.pageCount,
          pageNum: 0,
          onBottomStatus: 0,
          isLastPage: false,
          isRequire: false
      }, 
      hasReFresh: true}, () => {
          this.getRapidly(false).then(() => {
            this.setData({hasReFresh: false})
            wx.stopPullDownRefresh()
          })
        })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let tabIndex = this.data.tabIndex,
        listData = !tabIndex ? this.data.nowListData : this.data.oldListData
    if (listData.isLastPage) return
    this.getRapidly(false)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    return app.wxShare({
      options,
      title: '互联网高薪职位限时热抢，约面试还能领现金！快来~',
      path: 'page/applicant/pages/specialJob/specialJob',
      imageUrl: `${this.data.cdnImagePath}specialShare.png`
    })
  }
})