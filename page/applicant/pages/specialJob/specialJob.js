import {getRapidlyApi, getRecentApi} from '../../../../api/pages/specialJob.js'
import {getSelectorQuery} from '../../../../utils/util.js'
import {touchVkeyApi} from '../../../../api/pages/common.js'
import {COMMON, APPLICANT} from '../../../../config.js'
const app = getApp() 
let tabTop = 0,
    hasOnload = false,
    timer = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: app.globalData.navHeight,
    cdnImagePath: app.globalData.cdnImagePath,
    isJobhunter: app.globalData.isJobhunter,
    timeList: [],
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
    let init = () => {
      hasOnload = true
      if (app.getRoleInit) {
        this.setData({isJobhunter: app.globalData.isJobhunter})
        !app.globalData.isMicroCard ? this.initPage() : this.getRapidly()
      } else {
        app.getRoleInit = () => {
          this.setData({isJobhunter: app.globalData.isJobhunter})
          !app.globalData.isMicroCard ? this.initPage() : this.getRapidly()
        }
      }
    }
    if (app.loginInit) {
      init()
    } else {
      app.loginInit = () => {
        init()
      }
    }
  },
  onShow: function () {
    if (hasOnload) {
      if (!app.globalData.isMicroCard) this.initPage()
    }
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
    timer = setInterval(() => {
      let timeList = this.data.timeList,
          nowListData = this.data.itemIndex
      timeList.forEach((list, listIndex) => {
        list.forEach((item, itemIndex) => {
          let day = parseInt(item.day),
              hour = parseInt(item.hour),
              minute = parseInt(item.minute),
              second = parseInt(item.second)
          if (second && minute && hour && day) {
            second--
            if (second <= 0) {
              second = 60
              minute--
              if (minute <= 0) {
                minute = 60
                hour--
                if (hour <= 0) {
                  hour = 24
                  day--
                  if (day <= 0) day = 0
                }
              }
            }
          } else {
            console.log(`${nowListData[itemIndex][itemIndex].positionName}这个职位倒计时结束`)
            timeList = timeList[listIndex].splice(itemIndex, 1) // 删除改项
            let list = nowListData.list[listIndex].splice(itemIndex, 1) // 删除改项
            clearInterval(timer)
            this.setData({[`nowListData[${listIndex}]`]: list})
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
    touchVkeyApi({vkey})
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
      default:
        this.touchVkey(e)
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.nextTick(() => {
      getSelectorQuery('.tab').then(res => {
        tabTop = res.top
      })
    })
  },
  initPage () {
    let jumpCreate = () => {
      if (wx.getStorageSync('choseType') !== 'RECRUITER') {
        app.wxToast({
          title: '前往求职飞船',
          icon: 'loading',
          callback () {
            wx.reLaunch({
              url: `${APPLICANT}createUser/createUser?micro=true`
            })
          }
        })
      }
    }
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
    listFun(params).then(res => {
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
          this.setData({otherData})
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

  },
  onPageScroll(e) {
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
  },
  formSubmit(e) {
    app.postFormId(e.detail.formId)
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})