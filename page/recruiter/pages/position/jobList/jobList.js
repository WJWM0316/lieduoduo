import {getPositionListApi} from "../../../../../api/pages/position.js"

import {
  applyInterviewApi,
  confirmInterviewApi,
  refuseInterviewApi
} from '../../../../../api/pages/interview.js'

import {RECRUITER, COMMON} from '../../../../../config.js'

Page({
  data: {
    items: [],
    options: {},
    identity: ''
  },
  onLoad(options) {
    this.setData({identity: wx.getStorageSync('choseType'), options})
    let storage = wx.getStorageSync('interviewChatLists')
    let items = []
    if(storage && wx.getStorageSync('choseType') === 'RECRUITER') {
      items = storage.data
      this.setData({items})
      return;
    }
    getPositionListApi({recruiter: options.recruiterUid, is_online: 1}).then(res => {
      items = res.data
      items.map(field => field.active = false)
      this.setData({items})
    })
  },
  onClick(e) {
    let data = wx.getStorageSync('interviewData') || {}
    let job = e.currentTarget.dataset
    let params = {}

    data.positionName = job.name
    data.positionId = job.id
    switch(this.data.options.type) {
      case 'recruiter_chat':
        params.jobhunterUid = this.data.options.jobhunterUid
        params.positionId = job.id
        this.applyInterview(params)
        break
      case 'job_hunting_chat':
        params.recruiterUid = this.data.options.recruiterUid
        if(job.id !== 'person') params.positionId = job.id
        this.applyInterview(params)
        break
      case 'confirm_chat':
        params.id = job.id
        this.confirmInterview(params)
        break
      case 'reject_chat':
        params.id = job.id

        // 都不合适 传对方的ID
        if(this.data.identity === 'APPLICANT' && job.id === 'unsuitable') {
          this.refuseInterview({id: this.data.options.recruiterUid})
          return;
        }
        // 都不合适 传对方的ID
        if(this.data.identity === 'RECRUITER' && job.id === 'unsuitable') {
          this.refuseInterview({id: this.data.options.jobhunterUid})
          return;
        }
        // this.refuseInterview(params)
        break
      default:
        wx.setStorageSync('interviewData', data)
        wx.navigateBack({delta: 1})
        break
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-09
   * @detail   开撩
   * @return   {[type]}          [description]
   */
  applyInterview(params) {
    applyInterviewApi(params).then(res => {
      wx.navigateBack({delta: 1})
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-09
   * @detail   接受约面
   * @return   {[type]}          [description]
   */
  confirmInterview(params) {
    confirmInterviewApi(params).then(res => {
     wx.removeStorageSync('interviewChatLists')
     wx.redirectTo({url: `${COMMON}arrangement/arrangement?id=${params.id}`})
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-09
   * @detail   拒绝开撩
   * @return   {[type]}          [description]
   */
  refuseInterview(params) {
    refuseInterviewApi(params).then(res => {
      wx.navigateBack({delta: 1})
      wx.removeStorageSync('interviewChatLists')
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-02-01
   * @detail   f布职位
   * @return   {[type]}   [description]
   */
  publicPosition() {
    wx.navigateTo({url: `${RECRUITER}position/post/post`})
  }
})