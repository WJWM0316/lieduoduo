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

const app = getApp()

Page({
  data: {
    identity: '',
    detail: {},
    query: {},
    isRecruiter: false,
    companyInfos: {},
    recruiterInfo: {},
    cdnPath: app.globalData.cdnImagePath
  },
  onLoad(options) {
    this.setData({query: options, identity: app.globalData.identity})
  },
  onShow() {
    this.getPositionDetail()
  },
  backEvent() {
     if(wx.getStorageSync('choseType') === 'RECRUITER') {
      wx.navigateTo({url: `${RECRUITER}position/index/index`})
     } else {
      wx.navigateBack({delta: 1})
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
    getPositionApi({id: this.data.query.positionId})
      .then(res => {
        this.setData({detail: res.data, companyInfos: res.data.companyInfo, recruiterInfo: res.data.recruiterInfo})
        app.getAllInfo()
          .then(userInfos => {
            this.setData({isOwner: userInfos.uid === res.data.recruiterInfo.uid, isRecruiter: true})
            if(this.selectComponent('#interviewBar')) this.selectComponent('#interviewBar').init()
            // if(userInfos.uid === res.data.recruiterInfo.uid) {
            //   wx.setStorageSync('choseType', 'RECRUITER')
            //   this.setData({isRecruiter: true})
            // }
          })
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
            this.setData({detail}, () => app.wxToast({title: '职位已开放'}))
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
                detail.status = 1
                that.setData({detail}, () => app.wxToast({title: '职位已关闭'}))
              })
          }
        })
        break
      case 'share':
        console.log('share')
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
  }
})