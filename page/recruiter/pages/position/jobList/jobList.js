import {getPositionListApi} from "../../../../../api/pages/position.js"

import {
  applyInterviewApi,
  confirmInterviewApi,
  refuseInterviewApi
} from '../../../../../api/pages/interview.js'

import {RECRUITER, COMMON} from '../../../../../config.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    options: {},
    identity: ''
  },
  onLoad(options) {
    this.setData({identity: wx.getStorageSync('choseType')})
    const storage = wx.getStorageSync('interviewChatLists')
    if(storage) {
      this.setData({items: storage.data, options})
      return;
    }
    getPositionListApi({recruiter: options.recruiterUid}).then(res => {
      this.setData({items: res.data, options})
    })
  },
  radioChange(e) {
    const data = wx.getStorageSync('interviewData') || {}
    const job = e.detail.value.split(' ')
    const params = {}
    data.positionName = job[0]
    data.positionId = job[1]
    switch(this.data.options.type) {
      case 'recruiter_chat':
        params.jobhunterUid = this.data.options.jobhunterUid
        params.positionId = job[1]
        this.applyInterview(params)
        break
      case 'job_hunting_chat':
        params.recruiterUid = this.data.options.recruiterUid
        if(job[1] !== 'person') params.positionId = job[1]
        this.applyInterview(params)
        break
      case 'confirm_chat':
        params.id = job[1]
        this.confirmInterview(params)
        break
      case 'reject_chat':
        params.id = job[1]
        // 都不合适 传对方的ID
        if(this.data.identity === 'APPLICANT' && job[1] === 'unsuitable') {
          this.refuseInterview({recruiterUid: this.data.options.recruiterUid})
          return;
        }
        // 都不合适 传对方的ID
        if(this.data.identity === 'RECRUITER' && job[1] === 'unsuitable') {
          this.refuseInterview({jobhunterUid: this.data.options.jobhunterUid})
          return;
        }
        this.refuseInterview(params)
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
    applyInterviewApi(params)
      .then(res => {
        // wx.navigateBack({delta: 1})
        wx.redirectTo({
          url: `${COMMON}${this.data.options.from}/${this.data.options.from}?uid=${this.data.options.jobhunterUid}`
        })
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-09
   * @detail   接受约面
   * @return   {[type]}          [description]
   */
  confirmInterview(params) {
    confirmInterviewApi(params)
      .then(res => {
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
    refuseInterviewApi(params)
      .then(res => {
        // wx.navigateBack({delta: 1})
        wx.redirectTo({
          url: `${COMMON}${this.data.options.from}/${this.data.options.from}?uid=${this.data.options.jobhunterUid}`
        })
        wx.removeStorageSync('interviewChatLists')
      })
  }
})