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

const app = getApp()

Page({
  data: {
    identity: '',
    detail: {},
    query: {},
    isRecruiter: false,
    companyInfos: {},
    recruiterInfo: {},
    hasReFresh: false,
    cdnPath: app.globalData.cdnImagePath
  },
  onLoad(options) {
    if (options.scene) {
      options = app.getSceneParams(options.scene)
    }
    let identity = wx.getStorageSync('choseType')
    this.setData({query: options, identity})
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
  getPositionDetail() {
    let identity = wx.getStorageSync('choseType')
    if (app.globalData.isRecruiter) {
      this.setData({isRecruiter: app.globalData.isRecruiter})
    } else {
      app.getRoleInit = () => {
        this.setData({isRecruiter: app.globalData.isRecruiter})
      }
    }
    return getPositionApi({id: this.data.query.positionId})
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
        getMycollectPositionApi({id: this.data.detail.id})
          .then(res => {
            const detail = this.data.detail
            detail.isCollect = true
            this.setData({detail})
          })
        break
      case 'uncollect':
        deleteMycollectPositionApi({id: this.data.detail.id})
          .then(res => {
            const detail = this.data.detail
            detail.isCollect = false
            this.setData({detail})
          })
        break
      case 'about':
        wx.navigateTo({url: `${COMMON}homepage/homepage?companyId=${this.data.detail.companyId}`})
        break
      case 'make':
        app.wxConfirm({
          title: '切换身份',
          content: '是否切换为招聘官身份',
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

  onPullDownRefresh(hasLoading = true) {
    this.setData({hasReFresh: true})
    this.getPositionDetail().then(res => {
      this.setData({hasReFresh: false})
      wx.stopPullDownRefresh()
    }).catch(e => {
      wx.stopPullDownRefresh()
    })
  },

  onShareAppMessage(options) {
    let that = this
　　return app.wxShare({
      options,
      title: sharePosition(),
      noImg: true,
      path: `${COMMON}positionDetail/positionDetail?positionId=${that.data.query.positionId}`,
      imageUrl: `${that.data.cdnPath}positionList.png`
    })
  }
})