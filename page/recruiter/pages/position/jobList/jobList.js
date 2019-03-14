import {
  getPositionListApi,
  openPositionApi,
  getRecruiterPositionListApi,
  getfilterPositionListApi
} from "../../../../../api/pages/position.js"

import {
  applyInterviewApi,
  confirmInterviewApi,
  refuseInterviewApi
} from '../../../../../api/pages/interview.js'

import {RECRUITER, COMMON} from '../../../../../config.js'

const app = getApp()

Page({
  data: {
    options: {},
    identity: '',
    onBottomStatus: 0,
    offBottomStatus: 0,
    onLinePositionList: {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false
    },
    params: {},
    unsuitableChecked: false,
    personChecked: false,
    nowTab: 'online',
    buttonClick: false
  },
  onLoad(options) {
    this.setData({identity: wx.getStorageSync('choseType'), options})
  },
  onShow() {
    let onLinePositionList = {list: [], pageNum: 1, count: 20, isLastPage: false, isRequire: false}
    let storage = wx.getStorageSync('interviewChatLists')
    let value = this.data.onLinePositionList
    if(storage && wx.getStorageSync('choseType') === 'RECRUITER') {
      value.list = storage.data
      this.setData({onLinePositionList: value})
      return;
    }
    this.setData({onLinePositionList}, () => this.getLists())
  },
  getLists() {
    if(wx.getStorageSync('choseType') === 'RECRUITER') {
      return this.getonLinePositionListB()
    } else {
      return this.getonLinePositionListC()
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-03-14
   * @detail   获取上线职位列表
   * @return   {[type]}   [description]
   */
  getonLinePositionListB(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let options = this.data.options
      let onLinePositionList = this.data.onLinePositionList
      let params = {
        // recruiter: options.recruiterUid,
        is_online: 1,
        count: onLinePositionList.count,
        page: onLinePositionList.pageNum,
        hasLoading
      }
      getRecruiterPositionListApi(params).then(res => {
        // 如果没有数据 则拿下线数据
        if(!res.meta.total) {
          this.setData({nowTab: 'offline'}, () => this.getoffLinePositionListB(false))
          return
        }
        let onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        let list = res.data || []
        list.map(field => field.active = false)
        onLinePositionList.list = onLinePositionList.list.concat(list)
        onLinePositionList.pageNum++
        onLinePositionList.isRequire = true
        onLinePositionList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        this.setData({onLinePositionList, onBottomStatus}, () => resolve(res))
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-03-14
   * @detail   获取上线职位列表
   * @return   {[type]}   [description]
   */
  getonLinePositionListC(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let options = this.data.options
      let onLinePositionList = this.data.onLinePositionList
      let params = {
        count: onLinePositionList.count,
        page: onLinePositionList.pageNum,
        hasLoading,
        recruiter: options.recruiterUid
      }
      getPositionListApi(params).then(res => {
        let onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        let list = res.data || []
        list.map(field => field.active = false)
        onLinePositionList.list = onLinePositionList.list.concat(list)
        onLinePositionList.pageNum++
        onLinePositionList.isRequire = true
        onLinePositionList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        this.setData({onLinePositionList, onBottomStatus}, () => resolve(res))
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-03-14
   * @detail   获取下线职位列表
   * @return   {[type]}   [description]
   */
  getoffLinePositionListB(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let options = this.data.options
      let onLinePositionList = this.data.onLinePositionList
      let api = wx.getStorageSync('choseType') === 'RECRUITER' ? 'getRecruiterPositionListApi' : 'getPositionListApi'
      let params = {
        recruiter: options.recruiterUid,
        is_online: 2,
        status: '0,1,2',
        count: onLinePositionList.count,
        page: onLinePositionList.pageNum,
        hasLoading
      }
      getRecruiterPositionListApi(params).then(res => {
        let onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        onLinePositionList.list = onLinePositionList.list.concat(res.data || [])
        onLinePositionList.pageNum++
        onLinePositionList.isRequire = true
        onLinePositionList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        this.setData({onLinePositionList, onBottomStatus}, () => resolve(res))
      })
    })
  },
  onClick(e) {
    let data = wx.getStorageSync('interviewData') || {}
    let job = e.currentTarget.dataset
    let params = {}
    let options = this.data.options
    let items = this.data.onLinePositionList
    let key = ''
    let result = {}

    // 给不合适或者直接与我约面加按钮状态 并且选中的按钮只能有一个
    if(typeof job.id === 'string') {
      key = `${job.id}Checked`
      items.list.map(field => field.active = false)
      this.setData({onLinePositionList: items, unsuitableChecked: false, personChecked: false, [key]: !this.data[key]})
    } else {

      // 给列表判断选中的状态
      items.list.map((field, index) => {
        if(job.index === index) {
          field.active = !field.active
        } else {
          field.active = false
        }
      })
      this.setData({onLinePositionList: items, unsuitableChecked: false, personChecked: false})
    }

    data.positionName = job.name
    data.positionId = job.id

    switch(options.type) {
      case 'recruiter_chat':
        params.jobhunterUid = options.jobhunterUid
        params.positionId = job.id
        result = items.list.find((find, index) => job.index === index)
        this.setData({params, buttonClick: result.active})
        break
      case 'job_hunting_chat':
        params.recruiterUid = this.data.options.recruiterUid
        if(job.id !== 'person') params.positionId = job.id
        this.applyInterview(params)
        break
      case 'confirm_chat':
        params.id = job.id
        this.setData({params, buttonClick: true})
        break
      case 'reject_chat':
        result = items.list.find((find, index) => job.index === index)
        params.id = job.id
        params.positionId = result.positionId
        params.jobhunterUid = options.jobhunterUid

        // 都不合适 传对方的ID
        if(this.data.identity === 'APPLICANT' && job.id === 'unsuitable') {
          params.id = options.recruiterUid
        }
        // 都不合适 传对方的ID
        if(this.data.identity === 'RECRUITER' && job.id === 'unsuitable') {
          params.id = options.jobhunterUid
        }
        this.setData({params, buttonClick: result.active})
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
      wx.removeStorageSync('interviewChatLists')
      if(wx.getStorageSync('choseType') === 'RECRUITER') {
        wx.navigateTo({url: `${COMMON}arrangement/arrangement?id=${params.id}`})
      } else {
        wx.navigateBack({delta: 1 })
      }
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
      if(wx.getStorageSync('choseType') === 'RECRUITER') {
        wx.navigateTo({url: `${COMMON}arrangement/arrangement?id=${params.id}`})
      } else {
        wx.navigateBack({delta: 1 })
      }
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
      resolve(params)
      wx.removeStorageSync('interviewChatLists')
      if(wx.getStorageSync('choseType') === 'RECRUITER') {
        wx.navigateTo({url: `${COMMON}arrangement/arrangement?id=${params.id}`})
      } else {
        wx.navigateBack({delta: 1 })
      }
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
  },
  /**
   * @Author   小书包
   * @DateTime 2019-03-14
   * @detail   确认后提交
   */
  submit() {
    let options = this.data.options
    let params = this.data.params
    let that = this

    if(!this.data.buttonClick) {
      app.wxConfirm({
        title: '开放职位约面',
        content: '确认开放该职位进行约面吗？',
        showCancel: true,
        cancelText: '再想想',
        confirmText: '确定',
        cancelColor: '#BCBCBC',
        confirmColor: '#652791',
        confirmBack: () => {
          openPositionApi({id: params.positionId}).then(res => {
            that.applyInterview(params).then(() => wx.navigateBack({delta: 1 }))
          })
        }
      })
      return
    }
    switch(options.type) {
      case 'confirm_chat':
        this.confirmInterview(params)
        break
      case 'reject_chat':
        this.applyInterview(params)
        // this.refuseInterview(params)
        break
      case 'recruiter_chat':
        this.applyInterview(params)
      default:
        break
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   触底加载数据
   * @return   {[type]}   [description]
   */
  onReachBottom() {
    let onLinePositionList = {}
    let api = ''
    let storage = wx.getStorageSync('interviewChatLists')
    let value = this.data.onLinePositionList
    if(wx.getStorageSync('choseType') === 'RECRUITER') {
      api = this.data.nowTab === 'online' ? 'getonLinePositionListB' : 'getoffLinePositionListB'
    } else {
      api = 'getonLinePositionListC'
    }
    onLinePositionList = {list: [], pageNum: 1, count: 20, isLastPage: false, isRequire: false}
    if(storage && wx.getStorageSync('choseType') === 'RECRUITER') {
      value.list = storage.data
      this.setData({onLinePositionList: value})
      return;
    }

    onLinePositionList = this.data.onLinePositionList
    this.setData({onLinePositionList}, () => this.getLists())
    if(!onLinePositionList.isLastPage) {
      this[api](false).then(() => this.setData({onBottomStatus: 1}))
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   下拉重新获取数据
   * @return   {[type]}              [description]
   */
  onPullDownRefresh() {
    let api = this.data.nowTab === 'online' ? 'getonLinePositionListB' : 'getoffLinePositionListB'
    let onLinePositionList = {list: [], pageNum: 1, count: 20, isLastPage: false, isRequire: false}
    let storage = wx.getStorageSync('interviewChatLists')
    let value = this.data.onLinePositionList

    if(storage && wx.getStorageSync('choseType') === 'RECRUITER') {
      value.list = storage.data
      this.setData({onLinePositionList: value})
      return;
    }

    this.setData({onLinePositionList, hasReFresh: true})
    this[api](false).then(res => {
      wx.stopPullDownRefresh()
      this.setData({hasReFresh: false})
    })
  }
})