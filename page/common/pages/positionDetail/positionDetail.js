import {
  getPositionApi,
  openPositionApi,
  closePositionApi,
  findMorePsListApi,
  getPositionListNumApi,
  getMyPositionApi
} from '../../../../api/pages/position.js'

import {
  getMycollectPositionApi,
  deleteMycollectPositionApi
} from '../../../../api/pages/collect.js'

import {RECRUITER, APPLICANT, COMMON} from '../../../../config.js'

import {sharePosition} from '../../../../utils/shareWord.js'
import timePocessor from '../../../../utils/timePocessor.js'

let positionCard = ''
let app = getApp()
let identity = '',
    timer = null
Page({
  data: {
    detail: {},
    query: {},
    isRecruiter: false,
    companyInfos: {},
    recruiterInfo: {},
    findMore: {},
    time: {},
    hasReFresh: false,
    requireOAuth: false,
    cdnPath: app.globalData.cdnImagePath
  },
  onLoad(options) {
    positionCard = ''
    if (options.scene) options = app.getSceneParams(options.scene)
    identity = app.identification(options)
    this.findMorePsList(options)
    this.setData({query: options})
    if (options.todoAction === 'collect') {
      let e = {
        currentTarget : {
          dataset : {
            type : 'collect'
          }
        }
      }
      this.todoAction(e)
    }
  },
  onShow() {
    if (app.loginInit) {
      this.getPositionDetail()
    } else {
      app.loginInit = () => {
        this.getPositionDetail()
      }
    }
  },
  chatPosition () { // 开撩成功
    let applyNum = this.data.detail.rapidlyInfo.applyNum
    applyNum++
    this.setData({[`detail.rapidlyInfo.applyNum`]: applyNum})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-24
   * @detail   绑定状态的改变
   * @return   {[type]}   [description]
   */
  bindStatusChange(e) {
    let detail = e.detail
    detail.isOnline = detail.isOnline === 2 ? 1 : 2
    this.setData({detail})
  },
  findMorePsList (options) {
    findMorePsListApi({positionId: options.positionId}).then(res => {
      this.setData({findMore: res.data})
    })
  },
  viewMap(e) {
    const params = e.currentTarget.dataset
    wx.openLocation({
      latitude: Number(params.latitude),
      longitude: Number(params.longitude),
      scale: 14,
      address: `${params.address} ${params.doorplate}`,
      fail: res => {
        app.wxToast({title: '获取位置失败'})
      }
    })
  },
  reload() {
    this.getPositionDetail(false, true)
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-02
   * @detail   获取职位详情
   * @return   {[type]}   [description]
   */
  getPositionDetail(hasLoading = true, isReload = false) {
    let identity = wx.getStorageSync('choseType')
    let query = this.data.query
    if (app.globalData.isRecruiter) {
      this.setData({isRecruiter: app.globalData.isRecruiter})
    } else {
      app.getRoleInit = () => {
        this.setData({isRecruiter: app.globalData.isRecruiter})
      }
    }
    // 需要清除红点
    if(query.type && query.type === 'clear_red_dot') {
      return getMyPositionApi({id: this.data.query.positionId, hasLoading, isReload, ...app.getSource()}).then(res => {
        let requireOAuth = null
        if (this.data.query.sCode && !app.globalData.userInfo) {
          requireOAuth = true
        }
        if (res.data.lng) {
          res.data.markers = []
          res.data.markers.push({
            id: 1,
            longitude: res.data.lng,
            latitude: res.data.lat,
            label: {
              content: res.data.companyInfo.companyShortname,
              fontSize:'18rpx',
              color:'#282828',
              anchorX: '30rpx',
              anchorY: '-60rpx'
            }
          })
        }
        this.setData({
          requireOAuth: requireOAuth,
          detail: res.data, 
          companyInfos: res.data.companyInfo, 
          recruiterInfo: res.data.recruiterInfo, 
          isOwner: res.data.isOwner && identity === 'RECRUITER' ? true : false
        })
      })
    }
    // 正常获取数据
    return getPositionApi({id: this.data.query.positionId, hasLoading, isReload, ...app.getSource()})
      .then(res => {
        let requireOAuth = null
        if (this.data.query.sCode && !app.globalData.userInfo) {
          requireOAuth = true
        }
        if (res.data.lng) {
          res.data.markers = []
          res.data.markers.push({
            id: 1,
            longitude: res.data.lng,
            latitude: res.data.lat,
            label: {
              content: res.data.companyInfo.companyShortname,
              fontSize:'18rpx',
              color:'#282828',
              anchorX: '30rpx',
              anchorY: '-60rpx'
            }
          })
        }
        let time = {}
        if (res.data.isRapidly === 1) {
          time = timePocessor.restTime(res.data.rapidlyInfo.endTime.replace(/-/g, '/'))
          this.countDown(time)
        }
        let serviceEndTime = res.data.rapidlyServiceEndTime
        if (serviceEndTime) {
          res.data['serviceEndTime'] = `${parseInt(serviceEndTime.slice(5, 7))}月${parseInt(serviceEndTime.slice(8, 10))}日`
        }
        this.setData({
          requireOAuth: requireOAuth,
          detail: res.data, 
          companyInfos: res.data.companyInfo, 
          recruiterInfo: res.data.recruiterInfo,
          time,
          isOwner: res.data.isOwner && identity === 'RECRUITER' ? true : false
        })
    })
  },
  countDown (time) {
    clearTimeout(timer)
    timer= setTimeout(() => {
      let day = parseInt(time.day),
        hour = parseInt(time.hour),
        minute = parseInt(time.minute),
        second = parseInt(time.second)
      if (second || minute|| hour || day) {
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
      }
      
      time.day = day
      time.hour = hour >= 10 ? hour : '0' + hour
      time.minute = minute >= 10 ? minute : '0' + minute
      time.second = second >= 10 ? second : '0' + second
      this.setData({time})
      if (!second && !minute && !hour && !day) {
        clearInterval(timer)
        this.setData({[`detail.isRapidly`]: 2})
        console.log('倒计时结束')
        return
      } else {
        this.countDown(time)
      }
    }, 1000)
  },
  authSuccess () {
    let requireOAuth = false
    this.setData({requireOAuth})
  },
  onUnload: function () {
    clearTimeout(timer)
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-02
   * @detail   待办项
   * @return   {[type]}     [description]
   */
  todoAction(e) {
    let type = e.currentTarget.dataset.type
    let that = this
    switch(type) {
      case 'strategy':
        wx.navigateTo({url: `${APPLICANT}strategy/strategy`})
        break
      case 'open':
        openPositionApi({id: this.data.detail.id}).then(res => {
          let detail = this.data.detail
          detail.status = 0
          that.setData({detail}, () => app.wxToast({title: '职位已开放', icon: 'success'}))
          that.getPositionDetail()
        })
        break
      case 'close':
        app.wxConfirm({
          title: '确认关闭职位',
          content: '关闭职位后，候选人将不能查看和申请该职位',
          confirmText: '关闭职位',
          cancelText: '考虑一下',
          confirmBack() {
            closePositionApi({id: that.data.detail.id}).then(res => {
              getPositionListNumApi().then(res => {
                let recruiterDetails = app.globalData.recruiterDetails
                if(!res.data.online) recruiterDetails.positionNum = 0
                if(res.data.online) recruiterDetails.positionNum = res.data.online
                app.globalData.recruiterDetails = recruiterDetails
                app.wxToast({
                  title: '职位已关闭',
                  icon: 'success',
                  callback() {
                    that.getPositionDetail()
                  }
                })
              })
            })
          }
        })
        break
      case 'share':
        this.selectComponent('#shareBtn').oper()
        break
      case 'edit':
        if (this.data.detail.isRapidly === 1) {
          app.wxToast({
            title: '该职位暂不可编辑'
          })
          return
        }
        wx.navigateTo({url: `${RECRUITER}position/post/post?positionId=${this.data.detail.id}`})
        break
      case 'collect':
        if (identity !== 'APPLICANT') {
          app.promptSwitch({
            source: identity
          })
          return
        }
        if (app.globalData.hasLogin && !app.globalData.isJobhunter) {
          let path = app.getCurrentPagePath()
          wx.navigateTo({url: `${APPLICANT}createUser/createUser?directChat=${encodeURIComponent(path)}&todoAction=collect&from=6`})
          return
        }
        getMycollectPositionApi({id: this.data.query.positionId}).then(res => {
          let detail = this.data.detail
          detail.isCollect = true
          this.setData({detail}, () => app.wxToast({title: '收藏成功', icon: 'success'}))
        })
        break
      case 'uncollect':
        if (identity !== 'APPLICANT') {
          app.promptSwitch({
            source: identity
          })
          return
        }
        deleteMycollectPositionApi({id: this.data.detail.id}).then(res => {
          let detail = this.data.detail
          detail.isCollect = false
          this.setData({detail}, () => app.wxToast({title: '取消收藏', icon: 'success'}))
        })
        break
      case 'about':
        wx.navigateTo({url: `${COMMON}homepage/homepage?companyId=${this.data.detail.companyId}`})
        break
      case 'make':
        app.wxConfirm({
          title: '切换身份',
          content: '是否切换为面试官身份',
          confirmText: '确定',
          showCancel: true,
          cancelText: '我再想想',
          confirmBack: () => {
            if(this.data.isRecruiter) {
              wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${this.data.detail.recruiterInfo.uid}`})
            } else {
              app.toggleIdentity()
            }
          }
        })
        break
      case 'map':
        wx.openLocation({
          latitude: Number(this.data.detail.lat),
          longitude: Number(this.data.detail.lng),
          scale: 14,
          name: this.data.detail.address,
          address: `${this.data.detail.doorplate}`,
          fail: res => {
            app.wxToast({title: '获取位置失败'})
          }
        })
        break
        case 'findMore':
          if (!this.data.findMore.matchTypeName) {
            wx.reLaunch({url: `${APPLICANT}index/index?positionTypeId=${this.data.findMore.matchType}`})
          } else {
            wx.reLaunch({url: `${APPLICANT}index/index?positionTypeId=${this.data.findMore.matchType}&typeName=${this.data.findMore.matchTypeName}`})
          }
          break
      default:
        break
    }
  },
  formSubmit(e) {
    app.postFormId(e.detail.formId)
  },
  onPullDownRefresh() {
    this.setData({hasReFresh: true})
    this.getPositionDetail(false, true).then(res => {
      this.setData({hasReFresh: false})
      wx.stopPullDownRefresh()
    }).catch(e => {
      wx.stopPullDownRefresh()
    })
  },
  getCreatedImg(e) {
    positionCard = e.detail
  },
  onShareAppMessage(options) {
    let that = this
    let detail = this.data.detail
    if(detail.isOnline === 2 && (!detail.status || detail.status === 1 || detail.status === 3 || detail.status === 4)) {
      console.log('职位异常', detail)
      return app.wxShare({options})
    }
    app.shareStatistics({
      id: that.data.query.positionId,
      type: 'position',
      sCode: that.data.detail.sCode,
      channel: 'card'
    })
　　return app.wxShare({
      options,
      title: sharePosition(),
      path: `${COMMON}positionDetail/positionDetail?positionId=${that.data.query.positionId}&sCode=${this.data.detail.sCode}&sourceType=shp`,
      imageUrl: positionCard
    })
  }
})