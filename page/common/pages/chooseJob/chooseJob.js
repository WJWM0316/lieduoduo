import {
  openPositionApi,
  getRecruiterPositionListApi,
  getfilterPositionListApi,
  getPositionListNumApi
} from "../../../../api/pages/position.js"

import {
  confirmInterviewApi,
  refuseInterviewApi,
  applyInterviewApi
} from '../../../../api/pages/interview.js'

import {
  getCompanyIdentityInfosApi
} from '../../../../api/pages/company.js'

import {
  applyChatApi
} from '../../../../api/pages/chat.js'

import {
  getRecommendChargeChatApi,
  getRecommendChargeInterviewApi
} from '../../../../api/pages/recruiter.js'

import {
  RECRUITER,
  COMMON
} from '../../../../config.js'

let app = getApp()

Page({
  data: {
    options: {},
    identity: '',
    onBottomStatus: 0,
    offBottomStatus: 0,
    onLinePositionList: {
      list: [],
      pageNum: 1,
      count: 10,
      isLastPage: false,
      isRequire: false
    },
    params: {},
    unsuitableChecked: false,
    nowTab: 'online',
    buttonClick: false,
    api: 'getonLinePositionListB',
    identityInfos: {},
    openPayPop: false,
    chargeData: {}, // 扣点信息
    interviewStatus: null,
    payTitle: '',
    showDownloadModel: false,
    downLoadAppType: 1
  },
  onLoad(options) {
    let api = ''
    if ( wx.getStorageSync('choseType') === 'RECRUITER' ) {
      this.getCompanyIdentityInfos()
    } else {
      api = 'getonLinePositionListC'
    }
    this.setData({identity: wx.getStorageSync('choseType'), options, api})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-29
   * @detail   获取个人身份信息
   * @return   {[type]}   [description]
   */
  getCompanyIdentityInfos() {
    getCompanyIdentityInfosApi({hasLoading: false}).then(res => this.setData({identityInfos: res.data}))
  },
  onShow() {
    let onLinePositionList = { list: [], pageNum: 1, count: 20, isLastPage: false, isRequire: false }
    this.setData({onLinePositionList}, () => this.getLists())
  },
  /**
   * @Author   小书包
   * @DateTime 2019-03-15
   * @detail   获取列表数据
   * @return   {[type]}   [description]
   */
  getLists() {
    // 求职端
    if(wx.getStorageSync('choseType') !== 'RECRUITER') {
      return this.getonLinePositionListC()
    }
    getPositionListNumApi().then(res => {
      let api = ''
      let nowTab = this.data.nowTab
      if ( !res.data.online ) {
        api = 'getoffLinePositionListB'
        nowTab = 'offline'
      } else {
        api = 'getonLinePositionListB'
        nowTab = 'online'
      }
      this.setData({api, nowTab}, () => this[api]())
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-03-14
   * @detail   获取上线职位列表
   * @return   {[type]}   [description]
   */
  getonLinePositionListB(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let onLinePositionList = this.data.onLinePositionList
      let params = {
        is_online: 1,
        count: onLinePositionList.count,
        page: onLinePositionList.pageNum,
        hasLoading
      }
      getRecruiterPositionListApi(params).then(res => {
        let onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        let list = res.data || []
        list.map(field => field.active = false)
        onLinePositionList.list = onLinePositionList.list.concat(list)
        onLinePositionList.pageNum++
        onLinePositionList.isRequire = true
        if(res.meta.nextPageUrl) {
          onLinePositionList.isLastPage = false
        } else {
          onLinePositionList.isLastPage = true
        }
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
      getfilterPositionListApi(params).then(res => {
        let onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        let list = res.data || []
        list.map(field => field.active = false)
        onLinePositionList.list = onLinePositionList.list.concat(list)
        onLinePositionList.pageNum++
        onLinePositionList.isRequire = true
        if(res.meta.nextPageUrl) {
          onLinePositionList.isLastPage = false
        } else {
          onLinePositionList.isLastPage = true
        }
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
        if(res.meta.nextPageUrl) {
          onLinePositionList.isLastPage = false
        } else {
          onLinePositionList.isLastPage = true
        }
        this.setData({onLinePositionList, onBottomStatus}, () => resolve(res))
      })
    })
  },
  // 获取扣点信息
  getRecommendCharge(params) {
    let funcApi = this.data.options.chattype === 'onekey' ? getRecommendChargeChatApi : getRecommendChargeInterviewApi
    return funcApi(params).then(({ data }) => this.setData({chargeData: data}))
  },
  /**
   * @Author   小书包
   * @DateTime 2019-03-15
   * @detail  选中当前的选项
   * @return   {[type]}     [description]
   */
  onClick(e) {
    let job = e.currentTarget.dataset
    let params = {}
    let options = this.data.options
    let items = this.data.onLinePositionList
    let key = ''
    let result = {}
    let buttonClick = this.data.buttonClick
    let data = {}
    data.positionName = job.name
    data.positionId = job.id

    // 给不合适或者直接与我约面加按钮状态 并且选中的按钮只能有一个
    if(typeof job.id === 'string') {
      key = `${job.id}Checked`
      items.list.map(field => field.active = false)
      this.setData({onLinePositionList: items, unsuitableChecked: false, [key]: true})
    } else {
      // 给列表判断选中的状态
      items.list.map((field, index) => {
        if(job.index === index) {
          field.active = true
        } else {
          field.active = false
        }
      })
      this.setData({onLinePositionList: items, unsuitableChecked: false})
    }

    switch(options.type) {

      // 招聘官主动发起约聊
      case 'recruiter_chat':
        params.jobhunter = options.jobhunterUid
        params.position = job.id
        params.status = job.status
        this.setData({ params, buttonClick: true },() => {
          this.getRecommendCharge({ jobhunter: this.data.options.jobhunterUid, positionId: params.position })
        })
        break
      // 求职者 主动发起约聊
      case 'job_hunting_chat':
        params.recruiter = this.data.options.recruiterUid
        if(job.id !== 'person') params.positionId = job.id
        this.applyInterview(params)
        break
      // 招聘官确认约聊
      case 'confirm_chat':
        params.id = job.id
        params.status = job.status
        params.positionId = job.positionId
        this.setData({ params, buttonClick: true })
        break
      // 招聘官拒绝约聊
      case 'reject_chat':
        if(this.data.identity === 'APPLICANT' && job.id === 'unsuitable') {
          params.id = options.recruiterUid
          buttonClick = this.data.unsuitableChecked
        } else if(this.data.identity === 'RECRUITER' && job.id === 'unsuitable') {
          params.id = options.jobhunterUid
          params.status = this.data.interviewStatus
          buttonClick = this.data.unsuitableChecked
        } else {
          result = items.list.find((find, index) => job.index === index)
          params.id = job.id
          params.positionId = result.positionId
          params.jobhunterUid = options.jobhunterUid
          buttonClick = result.active
          params.status = job.status
        }
        this.setData({params, buttonClick})
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
   * @detail   约聊
   * @return   {[type]}          [description]
   */
  applyInterview(params) {
    return new Promise((resolve, reject) => {
      app.wxReportAnalytics('btn_report', {
        isjobhunter: app.globalData.isJobhunter,
        resume_perfection: app.globalData.resumeInfo.resumeCompletePercentage * 100,
        btn_type: 'job-hunting-chat'
      })
      let data = {}
      let funcApi = ''
      let that = this
      if (this.data.options.chattype === 'onekey' || this.data.identity === 'APPLICANT') {
        data = params
        funcApi = applyChatApi
      } else {
        data = {
          jobhunterUid: params.jobhunter,
          positionId: params.position,
          isAdvisor: 1
        }
        funcApi = applyInterviewApi
      }
      funcApi(data).then(res => {
        resolve(res)
        //  求职端返回上一页
        if(wx.getStorageSync('choseType') !== 'RECRUITER') {
          wx.navigateBack({
            delta: 1,
            success() {
              if (app.globalData.resumeInfo.resumeCompletePercentage > 0.75) {
                that.setData({downLoadAppType: 2}, () => {
                  this.selectComponent('#downLoadApp').show()
                })
              } else {
                that.setData({downLoadAppType: 1}, () => {
                  this.selectComponent('#downLoadApp').show()
                })
              }
            }
          })
        }
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
    confirmInterviewApi(params).then(res => {
     wx.removeStorageSync('interviewChatLists')
      if(wx.getStorageSync('choseType') === 'RECRUITER') {
        wx.redirectTo({url: `${COMMON}arrangement/arrangement?id=${params.id}`})
      } else {
        wx.navigateBack({delta: 1 })
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-09
   * @detail   拒绝约聊
   * @return   {[type]}          [description]
   */
  refuseInterview(params) {
    refuseInterviewApi(params).then(res => {
      wx.removeStorageSync('interviewChatLists')
      if(wx.getStorageSync('choseType') === 'RECRUITER' && !this.data.unsuitableChecked) {
        wx.navigateTo({url: `${COMMON}arrangement/arrangement?id=${params.id}`})
      } else {
        wx.navigateBack({delta: 1 })
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-02-01
   * @detail   发布职位
   * @return   {[type]}   [description]
   */
  publicPosition() {
    let identityInfos = this.data.identityInfos
    // 跟后端协商  =1 则可以发布
    if(identityInfos.identityAuth || identityInfos.status === 1) {
      wx.navigateTo({url: `${RECRUITER}position/post/post`})
      return;
    }
    // 已经填写身份证 但是管理员还没有处理或者身份证信息不符合规范
    if(identityInfos.status === 0 || identityInfos.status === 2) {
      app.wxConfirm({
        title: '',
        content: `您当前认证身份信息已提交申请，猎多多将尽快审核处理，请耐心的等待，感谢您的配合~`,
        cancelText: '联系客服',
        confirmText: '我知道了',
        confirmBack: () => {
          wx.navigateTo({url: `${RECRUITER}user/company/status/status?from=identity`})
        },
        cancelBack: () => {
          wx.makePhoneCall({phoneNumber: this.data.telePhone})
        }
      })
      return;
    }
    // 没有填身份证 则没有验证
    if(!identityInfos.identityNum) {
      app.wxConfirm({
        title: '',
        content: `检测到您尚未认证身份，请立即认证，完成发布职位`,
        confirmText: '去认证',
        confirmBack: () => {
          wx.navigateTo({url: `${RECRUITER}user/company/identity/identity?from=identity`})
        }
      })
      return;
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-03-14
   * @detail   确认面试
   */
  confirmChat() {
    let params = this.data.params
    let that = this
    if(params.status === 0) {
      app.wxConfirm({
        title: '开放职位约面',
        content: '确认开放该职位进行约面吗？',
        showCancel: true,
        cancelText: '再想想',
        confirmText: '确定',
        cancelColor: '#BCBCBC',
        confirmColor: '#652791',
        confirmBack: () => {
          openPositionApi({id: params.positionId}).then(res => that.confirmInterview(params))
        }
      })
    } else if(params.status === 3 || params.status === 4) {
      app.wxToast({title: '该职位未开放，不可选择约面'})
    } else {
      this.confirmInterview(params)
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-03-14
   * @detail   拒绝面试
   */
  rejectChat() {
    let options = this.data.options
    let params = this.data.params
    let that = this
    // 0已经关闭的职位
    if( params.status === 0 ) {
      app.wxConfirm({
        title: '开放职位约面',
        content: '确认开放该职位进行约面吗？',
        showCancel: true,
        cancelText: '再想想',
        confirmText: '确定',
        cancelColor: '#BCBCBC',
        confirmColor: '#652791',
        confirmBack: () => {
          openPositionApi({id: params.positionId}).then(res => that.confirmInterview(params))
        }
      })
    } else if(params.status === 3 || params.status === 4) {
      app.wxToast({title: '该职位未开放，不可选择约面'})
    } else {
      // 都不合适 则直接拒绝
      if(this.data.unsuitableChecked) {
        wx.navigateTo({url: `${COMMON}interviewMark/interviewMark?type=pending&jobhunterUid=${params.id}&reBack=2&status=${params.status}`})
        // this.refuseInterview(params)
      } else {
        // 用选中的面试记录发起约聊
        this.confirmInterview(params)
      }
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-03-14
   * @detail   招聘官发起开聊
   */
  recruiterChat() {
    let options = this.data.options
    let params = this.data.params
    let that = this
    if(!this.data.buttonClick) return;
    // 需要扣点
    if (this.data.chargeData.needCharge && !this.data.openPayPop) {
      this.setData({openPayPop: true})
      return
    }
    if( params.status === 0 ) {
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
            that.applyInterview(params).then(res => that.setData({openPayPop: false, downLoadAppType: 9}, () => {
              this.selectComponent('#downLoadApp').show()
            }))
          })
        }
      })
    } else if(params.status === 3 || params.status === 4) {
      app.wxToast({title: '该职位未开放，不可选择约面'})
    } else {
      this.applyInterview(params).then(res => that.setData({openPayPop: false, downLoadAppType: 9}, () => {
        this.selectComponent('#downLoadApp').show()
      }))
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-03-14
   * @detail   确认后提交
   */
  submit() {
    let options = this.data.options
    if(!this.data.buttonClick) return;
    switch(options.type) {
      // 确认约聊
      case 'confirm_chat':
        this.confirmChat()
        break
      case 'reject_chat':
        this.rejectChat()
        break
      case 'recruiter_chat':
        this.recruiterChat()
        break
      default:
        break
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   关闭支付弹窗
   * @return   {[type]}   [description]
   */
  closePayPop () {
    this.setData({openPayPop: false})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   触底加载数据
   * @return   {[type]}   [description]
   */
  onReachBottom() {
    let onLinePositionList = {}
    let storage = wx.getStorageSync('interviewChatLists')
    if(storage && wx.getStorageSync('choseType') === 'RECRUITER') {
      onLinePositionList = {list: [], pageNum: 1, count: 20, isLastPage: false, isRequire: false}
      onLinePositionList.list = storage.data
      this.setData({onLinePositionList})
      return;
    }
    onLinePositionList = this.data.onLinePositionList
    this.setData({onLinePositionList})
    if(!onLinePositionList.isLastPage) {
      this[this.data.api](false).then(() => this.setData({onBottomStatus: 1}))
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   关闭弹窗 直接回到简历详情
   * @return   {[type]}   [description]
   */
  closeDownloadModel() {
    this.setData({showDownloadModel: false})
  }
})