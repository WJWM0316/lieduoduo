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

  /**
   * 页面的初始数据
   */
  data: {
    identity: '',
    detail: {},
    query: {},
    isRecruiter: false,
    companyInfos: {},
    recruiterInfo: {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({query: options, identity: getApp().globalData.identity})
    this.getPositionDetail()
    getUserRoleApi()
      .then(res => {
        if(res.data.isRecruiter) this.setData({isRecruiter: true})
      })
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
            this.selectComponent('#interviewBar').init()
            this.setData({isOwner: userInfos.uid === res.data.recruiterInfo.uid})
            if(userInfos.uid === res.data.recruiterInfo.uid) {
              wx.setStorageSync('choseType', 'RECRUITER')
            }
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
    switch(type) {
      case 'open':
        openPositionApi({id: this.data.detail.id})
          .then(res => {
            this.getPositionDetail()
          })
        break
      case 'close':
        closePositionApi({id: this.data.detail.id})
          .then(res => {
            this.getPositionDetail()
          })
        break
      case 'collect':
        getMycollectPositionApi({id: this.data.detail.id})
          .then(res => {
            this.getPositionDetail()
          })
        break
      case 'uncollect':
        deleteMycollectPositionApi({id: this.data.detail.id})
          .then(res => {
            this.getPositionDetail()
          })
        break
      case 'chat':
        // applyInterviewApi({recruiterUid: 90, positionId: 39})
        applyInterviewApi({recruiterUid: this.data.detail.recruiterInfo.uid, positionId: this.data.detail.id})
          .then(res => {
            this.getPositionDetail()
          })
        break
      case 'edit':
        wx.navigateTo({url: `${RECRUITER}position/post/post?positionId=${this.data.detail.id}`})
        break
      case 'about':
        wx.navigateTo({url: `${COMMON}homepage/homepage?companyId=${this.data.detail.companyId}`})
        break
      case 'map':
        wx.navigateTo({url: `${COMMON}map/map?lat=${this.data.detail.lat}&lng=${this.data.detail.lat}`})
        break
      default:
        break
    }
  }
})