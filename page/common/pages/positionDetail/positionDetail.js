import {
  getPositionApi,
  openPositionApi,
  closePositionApi
} from '../../../../api/pages/position.js'

import {
  getMycollectPositionApi,
  deleteMycollectPositionApi
} from '../../../../api/pages/collect.js'
import {getUserRoleApi} from "../../../../api/pages/user.js"

import {RECRUITER, COMMON} from '../../../../config.js'

import {sharePosition} from '../../../../utils/shareWord.js'

let positionCard = ''
const app = getApp()
let identity = ''
Page({
  data: {
    detail: {},
    query: {},
    isRecruiter: false,
    companyInfos: {},
    recruiterInfo: {},
    hasReFresh: false,
    cdnPath: app.globalData.cdnImagePath
  },
  onLoad(options) {
    positionCard = ''
    if (options.scene) options = app.getSceneParams(options.scene)
    identity = app.identification(options)
    this.setData({query: options})
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
  /**
   * @Author   小书包
   * @DateTime 2019-01-24
   * @detail   绑定状态的改变
   * @return   {[type]}   [description]
   */
  bindStatusChange(e) {
    const detail = e.detail
    detail.isOnline = detail.isOnline === 2 ? 1 : 2
    this.setData({detail})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-02
   * @detail   获取职位详情
   * @return   {[type]}   [description]
   */
  getPositionDetail(hasLoading = true, isReload = false) {
    let identity = wx.getStorageSync('choseType')
    if (app.globalData.isRecruiter) {
      this.setData({isRecruiter: app.globalData.isRecruiter})
    } else {
      app.getRoleInit = () => {
        this.setData({isRecruiter: app.globalData.isRecruiter})
      }
    }
    return getPositionApi({id: this.data.query.positionId, hasLoading, isReload, ...app.getSource()})
      .then(res => {
        this.setData({
          detail: res.data, 
          companyInfos: res.data.companyInfo, 
          recruiterInfo: res.data.recruiterInfo, 
          isOwner: res.data.isOwner && identity === 'RECRUITER' ? true : false
        })
        if(this.selectComponent('#interviewBar')) this.selectComponent('#interviewBar').init()
    })
  },


  /**
   * @Author   小书包
   * @DateTime 2019-01-02
   * @detail   待办项
   * @return   {[type]}     [description]
   */
  todoAction(e) {
    const type = e.currentTarget.dataset.type
    const that = this
    switch(type) {
      case 'open':
        openPositionApi({id: this.data.detail.id})
          .then(res => {
            const detail = this.data.detail
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
            closePositionApi({id: that.data.detail.id})
              .then(res => {
                const detail = that.data.detail
                that.setData({detail}, () => app.wxToast({title: '职位已关闭', icon: 'success'}))
                that.getPositionDetail()
              })
          }
        })
        break
      case 'share':
        this.selectComponent('#shareBtn').oper()
        break
      case 'edit':
        wx.navigateTo({url: `${RECRUITER}position/post/post?positionId=${this.data.detail.id}`})
        break
      case 'collect':
        if (identity !== 'APPLICANT') {
          app.promptSwitch({
            source: identity
          })
          return
        }
        getMycollectPositionApi({id: this.data.detail.id})
          .then(res => {
            const detail = this.data.detail
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
        deleteMycollectPositionApi({id: this.data.detail.id})
          .then(res => {
            const detail = this.data.detail
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
      default:
        break
    }
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
    app.shareStatistics({
      id: that.data.query.positionId,
      type: 'position',
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