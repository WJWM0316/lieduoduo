import {
  getMyBrowseUsersListApi,
  getMyBrowsePositionApi,
  getBrowseMySelfApi,
  getCollectMySelfApi,
  getMyCollectUsersApi
} from '../../../../api/pages/browse.js'

import {
  getBrowseMySelfListsApi,
  getIndexShowCountApi
} from '../../../../api/pages/recruiter.js'

import {RECRUITER, COMMON, APPLICANT} from '../../../../config.js'

import {getSelectorQuery}  from '../../../../utils/util.js'

import { getPositionListNumApi } from '../../../../api/pages/position.js'


import {
  getAdBannerApi
} from '../../../../api/pages/common'

let app = getApp()
let fixedDomPosition = 0

Page({
  data: {
    pageList: 'collectMySelf',
    cdnImagePath: app.globalData.cdnImagePath,
    navH: app.globalData.navHeight,
    choseType: '',
    browseMySelf: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      total: 0
    },
    collectMySelf: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      isUse: false
    },
    pageCount: 20,
    background: 'transparent',
    hasReFresh: false,
    onBottomStatus: 0,
    isFixed: true,
    fixedDom: false,
    detail: {},
    welcomeWord: '',
    indexShowCount: {
      jobHunterInterestedToR: 0,
      recentInterview: 0,
      onlinePosition: 0,
      moreRecruiter: [],
      rankDetail: {
        currentRank: 0,
        influence: 0,
        popularity: 0
      }
    },
    banner: {}
  },
  onLoad() {
    let choseType = wx.getStorageSync('choseType') || ''
    this.setData({choseType})
    if (choseType === 'APPLICANT') {
      app.wxConfirm({
        title: '提示',
        content: '检测到你是求职者，是否切换求职者',
        confirmBack() {
          wx.reLaunch({url: `${APPLICANT}index/index` })
        },
        cancelBack() {
          wx.setStorageSync('choseType', 'RECRUITER')
          app.getAllInfo()
        }
      })
    }

    if (app.loginInit) {
      this.getLists().then(() => {
        this.getDomNodePosition()
        this.setData({detail: app.globalData.recruiterDetails})
      })
    } else {
      this.getLists().then(() => {
        this.getDomNodePosition()
        this.setData({detail: app.globalData.recruiterDetails})
      })
    }
  },
  onShow() {

    let collectMySelf = this.data.collectMySelf
    if(!collectMySelf.list.length) {
      this.getLists().then(() => {
        this.getMixdata()
        this.getDomNodePosition()
      })
    }
    
    // let browseMySelf = {
    //   list: [],
    //   pageNum: 1,
    //   isLastPage: false,
    //   isRequire: false,
    //   total: 0
    // }

    // let collectMySelf = {
    //   list: [],
    //   pageNum: 1,
    //   isLastPage: false,
    //   isRequire: false,
    //   isUse: false
    // }

    // if (app.loginInit) {
    //   this.getMixdata()
    //   this.setData({detail: app.globalData.recruiterDetails}, () => this.getLists().then(() => this.getDomNodePosition()))
    // } else {
    //   app.loginInit = () => {
    //     this.getMixdata()
    //     this.setData({detail: app.globalData.recruiterDetails}, () => this.getLists().then(() => this.getDomNodePosition()))
    //   }
    // }
  },
  getMixdata() {
    getIndexShowCountApi().then(res => this.setData({indexShowCount: res.data}))
    getAdBannerApi({location: 'recruiter_index'}).then(res => this.setData({banner: res.data[0]}))
    this.getWelcomeWord()
  },
  getDomNodePosition() {
    getSelectorQuery('.index-list-box').then(res => fixedDomPosition = res.top - this.data.navH)
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   获取列表数据
   * @return   {[type]}   [description]
   */
  getLists() {
    if(this.data.pageList !== 'collectMySelf') {
      return this.getBrowseMySelf()
    } else {
      return this.getCollectMySelf()
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   看过我的列表
   * @return   {[type]}   [description]
   */
  getBrowseMySelf(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let params = {count: this.data.pageCount, page: this.data.browseMySelf.pageNum, ...app.getSource()}
      getBrowseMySelfApi(params, hasLoading).then(res => {
        let browseMySelf = this.data.browseMySelf
        let onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        browseMySelf.list = browseMySelf.list.concat(res.data)
        browseMySelf.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        browseMySelf.pageNum = browseMySelf.pageNum + 1
        browseMySelf.isRequire = true
        browseMySelf.total = res.meta.total
        this.setData({browseMySelf, onBottomStatus}, () => resolve(res))
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   收集过我的列表
   * @return   {[type]}   [description]
   */
  getCollectMySelf(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let params = {count: this.data.pageCount, page: this.data.collectMySelf.pageNum, ...app.getSource()}
      getCollectMySelfApi(params, hasLoading).then(res => {
        let collectMySelf = this.data.collectMySelf
        let onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        let list = this.appendData(res.data, collectMySelf)
        collectMySelf.list = collectMySelf.list.concat(list)
        collectMySelf.isLastPage = res.meta.nextPageUrl ? false : true
        collectMySelf.pageNum = collectMySelf.pageNum + 1
        collectMySelf.isRequire = true
        this.setData({collectMySelf, onBottomStatus}, () => resolve(res))
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-05-14
   * @detail   追加数据
   * @return   {[type]}   [description]
   */
  appendData(list, collectMySelf) {
    let detail = this.data.detail
    let data = list
    let item = {}
    if(!collectMySelf.isUse) {
      if(data.length) {
        collectMySelf.isUse = true
        if(!detail.positionNum) item.myType = 1
        if(detail.positionNum) item.myType = 2
        if(data.length < 7) data.push(item)
        if(data.length >= 7) data.splice(6, 0, item)
      }
    }
    return data
  },
  /**
   * @Author   小书包
   * @DateTime 2019-05-13
   * @detail   tqb切换
   * @return   {[type]}     [description]
   */
  ontabClick(e) {
    let pageList = e.currentTarget.dataset.key
    this.setData({ pageList }, () => {
      let key = this.data.pageList
      getIndexShowCountApi().then(res => this.setData({indexShowCount: res.data}))
      if(!this.data[key].isRequire) this.getLists()
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   下拉重新获取数据
   * @return   {[type]}              [description]
   */
  onPullDownRefresh(hasLoading = true) {
    let key = this.data.pageList
    let value = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
    this.setData({[key]: value, hasReFresh: true, detail: app.globalData.recruiterDetails})
    
    getIndexShowCountApi().then(res => this.setData({indexShowCount: res.data}))
    this.getLists().then(res => {
      let value = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
      let onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
      value.list = res.data
      value.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
      value.pageNum = 2
      value.isRequire = true
      value.total = res.meta.total
      this.setData({[key]: value, onBottomStatus}, () => {
        wx.stopPullDownRefresh()
        wx.pageScrollTo({scrollTop: 0 })
        this.setData({hasReFresh: false})
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   触底加载数据
   * @return   {[type]}   [description]
   */
  onReachBottom() {
    let key = this.data.pageList
    if (!this.data[key].isLastPage) {
      this.setData({onBottomStatus: 1})
      this.getLists(false)
    }
  },
  onShareAppMessage(options) {
    let that = this
　　return app.wxShare({options})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-23
   * @detail   就算页面的滚动
   * @return   {[type]}     [description]
   */
  onPageScroll(e) {
    if(e.scrollTop > 0) {
      this.setData({isFixed: true, background: '#652791'})
    } else {
      this.setData({isFixed: false, background: 'transparent'})
    }

    if(e.scrollTop > fixedDomPosition - 20) {
      this.setData({fixedDom: true})
    } else {
      this.setData({fixedDom: false})
    }
  },
  jump() {},
  formSubmit(e) {
    app.postFormId(e.detail.formId)
  },
  /**
   * @Author   小书包
   * @DateTime 查看求职者简历
   * @return   {[type]}     [description]
   */
  viewResumeDetail(e) {
    let params = e.currentTarget.dataset
    let uid = this.data.detail.uid
    if(!Object.keys(params).length) return;
    if(params.type === 1) {
      wx.reLaunch({url: `${RECRUITER}position/index/index`})
    } else if(params.type === 2) {
      wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${uid}`})
    } else {
      wx.navigateTo({url: `${COMMON}resumeDetail/resumeDetail?uid=${params.jobhunteruid}`})
    }
  },
  routeJump(e) {
    let route = e.currentTarget.dataset.route
    let uid = app.globalData.recruiterDetails.uid
    switch(route) {
      case 'interested':
        wx.navigateTo({url: `${RECRUITER}interested/interested`})
        break
      case 'interview':
        wx.reLaunch({url: `${RECRUITER}interview/index/index?tabIndex=2`})
        break
      case 'position':
        wx.reLaunch({url: `${RECRUITER}position/index/index`})
        break
      case 'rank':
        wx.navigateTo({url: `${COMMON}rank/rank`})
        break
      case 'recruiter':
        wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${uid}`})
        break
      default:
        break
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-05-10
   * @detail   根据时间显示不同的问候
   * @return   {[type]}   [description]
   */
  getWelcomeWord() {
    let d = new Date()
    if(d.getHours() >= 6 && d.getHours() < 12) {
      this.setData({welcomeWord: '早上好'})
    } else if(d.getHours() >= 12 && d.getHours() < 14) {
      this.setData({welcomeWord: '中午好'})
    } else if(d.getHours() >= 14 && d.getHours() < 18) {
      this.setData({welcomeWord: '下午好'})
    } else {
      this.setData({welcomeWord: '晚上好'})
    }
  }
})
