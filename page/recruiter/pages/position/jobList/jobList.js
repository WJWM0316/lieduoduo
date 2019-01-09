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
    console.log(wx.getStorageSync('choseType'))
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
    // console.log(job);return;
    switch(this.data.options.type) {
      case 'recruiter_chat':
        this.applyInterview({jobhunterUid: this.data.options.jobhunterUid, positionId: job[1]})
        break
      case 'job_hunting_chat':
        params.recruiterUid = this.data.options.recruiterUid
        if(job[1] !== 'person') params.positionId = job[1]
        this.applyInterview(params)
        break
      case 'confirm_chat':
        this.confirmInterview({id: job[1]})
        break
      case 'reject_chat':
        this.refuseInterview({id: job[1]})
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
        // wx.navigateTo({
        //   url: `${COMMON}${this.data.options.from}/${this.data.options.from}?uid=${this.data.options.jobhunterUid}`
        // })
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
        wx.navigateBack({delta: 1})
       wx.removeStorageSync('interviewChatLists')
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
        wx.navigateBack({delta: 1})
       wx.removeStorageSync('interviewChatLists')
      })
  }
})