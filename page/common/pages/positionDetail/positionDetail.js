import {
  getPositionApi,
  openPositionApi,
  closePositionApi
} from '../../../../api/pages/position.js'

import {
  applyInterviewApi
} from '../../../../api/pages/interview.js'

import {
  getCompanyInfosApi
} from '../../../../api/pages/company.js'

import {
  getMycollectPositionApi
} from '../../../../api/pages/collect.js'

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
    companyInfos: {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // getApp().globalData.identity = 'RECRUITER'
    this.setData({query: options, identity: getApp().globalData.identity})
    this.getPositionDetail()
    this.getCompanyDetail()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-02
   * @detail   获取公司详情
   * @return   {[type]}   [description]
   */
  getCompanyDetail() {
    getCompanyInfosApi({id: this.data.query.companyId})
      .then(res => {
        this.setData({companyInfos: res.data})
        console.log(res.data)
      })
      .catch(err => {
        app.wxToast({title: err.msg})
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
        this.setData({detail: res.data})
      })
      .catch(err => {
        app.wxToast({title: err.msg})
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
          .catch(err => {
            app.wxToast({title: err.msg})
          })
        break
      case 'close':
        closePositionApi({id: this.data.detail.id})
          .then(res => {
            this.getPositionDetail()
          })
          .catch(err => {
            app.wxToast({title: err.msg})
          })
        break
      case 'collect':
        getMycollectPositionApi({id: this.data.detail.id})
          .then(res => {
            this.getPositionDetail()
          })
          .catch(err => {
            app.wxToast({title: err.msg})
          })
        break
      case 'chat':
        applyInterviewApi({recruiterUid: 90, positionId: 39})
        // applyInterviewApi({recruiterUid: this.data.detail.recruiterInfo.uid, positionId: this.data.detail.id})
        break
      case 'edit':
        wx.navigateTo({url: `${RECRUITER}position/post/post?positionId=${this.data.detail.id}`})
        break
      case 'about':
        wx.navigateTo({url: `${COMMON}homepage/homepage?companyId=${this.data.detail.companyId}`})
        break
      default:
        break
    }
  }
})