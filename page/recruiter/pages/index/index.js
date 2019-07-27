import {
  getIndexShowCountApi,
  getRecommendRangeAllApi,
  getRecommendResumePageListsApi,
  getRecommendResumeListsApi,
  getRecommendResumeMoreListsApi,
  getRecommendPositionRangeListsApi,
  getRecommendCityRangesListsApi
} from '../../../../api/pages/recruiter.js'

import {
  clearReddotApi,
  getAdBannerApi
} from '../../../../api/pages/common.js'

import {RECRUITER, COMMON, APPLICANT, WEBVIEW, VERSION} from '../../../../config.js'

import {getSelectorQuery}  from '../../../../utils/util.js'

let app = getApp()
let fixedDomPosition = 0

Page({
  data: {
    cdnImagePath: app.globalData.cdnImagePath,
    navH: app.globalData.navHeight,
    model: {
      show: false,
      title: '',
      type: ''
    },
    choseType: '',
    resumeList: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      showSystemData: false,
      onBottomStatus: 0
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
      },
      recruiterInterestedToJ: 0
    },
    banner: {},
    bannerIndex: 0,
    navTabIndex: 0,
    moveParams: {
      scrollLeft: 0
    },
    salaryLists: [],
    cityLists: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: 0
    },
    positionLists: {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: 0
    },
    recommended: 0,
    recommendResumeLists: {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: 0
    },
    recommendPositionRangeLists: {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: 0
    },
    exclusiveSelection: false,
    dealMultipleSelection: false,
    isReload: false
  },
  onLoad() {
    let choseType = wx.getStorageSync('choseType') || ''
    this.setData({ choseType})
    let that = this
    if (choseType === 'APPLICANT') {
      let that = this
      app.wxConfirm({
        title: '提示',
        content: '检测到你是求职者，是否切换求职者',
        confirmBack() {
          wx.reLaunch({url: `${APPLICANT}index/index` })
        },
        cancelBack() {
          wx.setStorageSync('choseType', 'RECRUITER')
          app.getAllInfo().then(res => {
            that.init()
          })
        }
      })
    }
  },
  onShow() {
    if (app.loginInit) {
      if (!app.globalData.hasLogin) {
        wx.navigateTo({url: `${COMMON}bindPhone/bindPhone`})
        return
      }
      this.init()
    } else {
      app.loginInit = () => {
        if (!app.globalData.hasLogin) {
          wx.navigateTo({url: `${COMMON}bindPhone/bindPhone`})
          return
        }
        this.init()
      }
    }
    
  },
  init () {
    if (wx.getStorageSync('choseType') === 'APPLICANT') return
    let userInfo = app.globalData.userInfo
    this.getDomNodePosition()
    if (app.pageInit) {
      userInfo = app.globalData.userInfo
      this.getMixdata()
      this.getRecommendRangeAll()
      this.setData({userInfo})
      this.selectComponent('#bottomRedDotBar').init()
      this.initDefaultBar()
    } else {
      app.pageInit = () => {
        userInfo = app.globalData.userInfo
        this.getMixdata()
        this.getRecommendRangeAll()
        this.setData({userInfo})
        this.selectComponent('#bottomRedDotBar').init()
        this.initDefaultBar()
      }
    }
  },
  initDefaultBar() {
    setTimeout(() => {
      getSelectorQuery('.tab-bar').then(res => {
        let moveParams = this.data.moveParams
        moveParams.screenHalfWidth = res.width / 2
        this.setData({moveParams})
      })
    }, 1000)
  },
  getMixdata() {
    this.getIndexShowCount().then(() => this.getBanner())
    this.getWelcomeWord()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-07-17
   * @detail   获取轮播图
   * @return   {[type]}   [description]
   */
  getBanner () {
    return getAdBannerApi({location: 'recruiter_index', hasLoading: false}).then(res => {
      let banner = res.data
      let recruiterDetails = app.globalData.recruiterDetails
      let path = encodeURIComponent(`${WEBVIEW}optimal?vkey=${recruiterDetails.vkey}&iso=0&version=${VERSION}&`)
      let otherUrl = `${COMMON}webView/webView?type=optimal&p=${path}`
          otherUrl = otherUrl.slice(1)
      let bigImgUrl = `${this.data.cdnImagePath}5d049a5ea678f@index.png`
      let indexShowCount = this.data.indexShowCount
      let item = {bigImgUrl, otherUrl }
      if(!indexShowCount.advisor) banner.unshift(item)
      this.setData({banner})
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-07-17
   * @detail   获取悬浮的 dom节点
   * @return   {[type]}   [description]
   */
  getDomNodePosition() {
    setTimeout(() => {
      getSelectorQuery('.default').then(res => {
        if(!fixedDomPosition) fixedDomPosition = res.top - this.data.navH
      })
    }, 1000)
  },
  /**
   * @Author   小书包
   * @DateTime 2019-07-17
   * @detail   模拟首页需要时时刷新的数据
   * @return   {[type]}   [description]
   */
  getIndexShowCount() {
    return new Promise((resolve, reject) => {
      if (wx.getStorageSync('choseType') === 'APPLICANT') {
        resolve()
        return
      }
      getIndexShowCountApi({hasLoading: false}).then(res => {
        this.setData({indexShowCount: res.data, detail: res.data.recruiterInfo}, () => resolve(res))
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   下拉重新获取数据
   * @return   {[type]}              [description]
   */
  onPullDownRefresh() {
    let api = this.data.recommended ? 'getRecommendResumeLists' : 'getRecommendResumePageLists'
    let resumeList = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      isUse: false,
      showSystemData: false,
      onBottomStatus: 0
    }
    let recommendResumeLists = {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: 0
    }
    this.setData({hasReFresh: true, resumeList, dealMultipleSelection: false, recommendResumeLists})
    this.selectComponent('#bottomRedDotBar').init()
    this.getMixdata()
    this.cacheData()
    this[api]().then(() => {
      resumeList.showSystemData = true
      this.setData({resumeList}, () => {
        if(!this.data.resumeList.list.length) this.getRecommendResumeMoreLists()
      })
      wx.stopPullDownRefresh()
      this.setData({fixedDom: false, hasReFresh: false})
    }).catch(() => {
      wx.stopPullDownRefresh()
      this.setData({hasReFresh: false})
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   触底加载数据
   * @return   {[type]}   [description]
   */
  onReachBottom() {
    let resumeList = this.data.resumeList
    if(!resumeList.isLastPage) {
      this.setData({onBottomStatus: 1})
      if(this.data.recommended) {
        this.getRecommendResumeLists()
      } else {
        this.getRecommendResumePageLists()
      }
    } else {
      if(!resumeList.list.length) this.getRecommendResumeMoreLists()
    }
  },
  onShareAppMessage(options) {
　　return app.wxShare({options})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-23
   * @detail   就算页面的滚动
   * @return   {[type]}     [description]
   */
  onPageScroll(e) {
    if(e.scrollTop > 10) {
      if (this.data.background !== '#652791') this.setData({isFixed: true, background: '#652791'})
    } else {
      if (this.data.background !== 'transparent') this.setData({isFixed: false, background: 'transparent'})
    }
    if(e.scrollTop > fixedDomPosition) {
      if(!this.data.fixedDom) this.setData({fixedDom: true})
    } else {
      if(this.data.fixedDom) this.setData({fixedDom: false})
    }
  },
  formSubmit(e) {
    app.postFormId(e.detail.formId)
  },
  /**
   * @Author   小书包
   * @DateTime 2019-07-24
   * @detail   缓存页面的数据
   * @return   {[type]}   [description]
   */
  cacheData(isReback = 1) {
    let params = {
      isReback
    }
    let cityItem = this.data.cityLists.list.find(field => field.active)
    let salaryLists = this.data.salaryLists.filter(field => field.active && field.id !== 1)
    let positionItem = this.data.positionLists.list.find(field => field.active)
    let salaryIds = []

    // 选择了城市
    if(cityItem && cityItem.areaId) {
      params = Object.assign(params, {areaId: cityItem.areaId})
    }
    // 选择了薪资
    if(salaryLists.length) {
      salaryIds = salaryLists.map(field => field.id)
      params = Object.assign(params, {salaryIds})
    }
    // 选择了职位
    if(positionItem && positionItem.id) {
      params = Object.assign(params, {positionId: positionItem.id})
    }

    wx.setStorageSync('cacheData', params);
  },
  /**
   * @Author   小书包
   * @DateTime 查看求职者简历
   * @return   {[type]}     [description]
   */
  viewResumeDetail(e) {
    let params = e.currentTarget.dataset
    if(!Object.keys(params).length) return;
    this.cacheData()
    wx.navigateTo({url: `${COMMON}resumeDetail/resumeDetail?uid=${params.jobhunteruid}&hot=true`})
  },
  routeJump(e) {
    let route = e.currentTarget.dataset.route
    this.cacheData()
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
        wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${this.data.detail.uid}`})
        break
      case 'adviser':
        wx.navigateTo({url: `${RECRUITER}user/adviser/adviser`})
        break
      case 'dynamics':
        wx.navigateTo({url: `${RECRUITER}dynamics/dynamics`})
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
  },
  autoplay (e) {
    this.setData({bannerIndex: e.detail.current})
  },
  toJump(e) {
    let url = '/' + e.currentTarget.dataset.url
    wx.navigateTo({ url })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-07-16
   * @detail   显示蒙层
   * @return   {[type]}     [description]
   */
  openTips(e) {
    let params = e.currentTarget.dataset
    let model = this.data.model
    model.show = true
    switch(params.type) {
      case 'position':
        model.title = '在招职位筛选'
        model.type = 'position'
        break
      case 'reduction':
        model.title = ''
        model.type = 'reduction'
        break
      default:
        break
    }
    this.setData({model})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-07-16
   * @detail   关闭蒙层
   * @return   {[type]}   [description]
   */
  closeTips() {
    let model = this.data.model
    model.show = false
    this.setData({model})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-07-16
   * @detail   弹窗职位选择
   * @return   {[type]}     [description]
   */
  sChoice(e) {
    let params = e.currentTarget.dataset
    let positionLists = this.data.positionLists
    let model = this.data.model
    let item = null
    model.show = false

    if(params.index <= 20) {
      positionLists.list.map((field, index) => field.active = index === params.index ? true : false)
      item = positionLists.list.find(field => field.active)
      positionLists.list.map((field, index) => {
        field.active = false
        if(field.id === item.id) {
          field.active = true
          this.clickNav({
            target: {
              dataset: {
                index
              }
            }
          })
        }
      })
    } else {
      item = positionLists.list.splice(params.index, 1)[0]
      positionLists.list.splice(1, 0, item)
      positionLists.list[1].active = true
      this.clickNav({
        target: {
          dataset: {
            index: 1
          }
        }
      })
    }
    this.setData({positionLists, model})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-07-13
   * @detail   薪资选择
   * @return   {[type]}     [description]
   */
  mChoice(e) {
    let params = e.currentTarget.dataset
    let salaryLists = this.data.salaryLists
    if(params.index) {
      salaryLists[0].active = false
      salaryLists.map((field, index) => {
        if(index === params.index) field.active = !field.active
      })
    } else {
      salaryLists.map(field => field.active = false)
      salaryLists[0].active = true
    }
    this.setData({salaryLists})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-07-16
   * @detail   弹层获取更多职位
   * @return   {[type]}   [description]
   */
  lower() {
    let positionLists = this.data.positionLists
    if (!positionLists.isLastPage) {
      this.getRecommendPositionRangeLists()
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-07-13
   * @detail   城市选择
   * @return   {[type]}     [description]
   */
  cChoice(e) {
    let params = e.currentTarget.dataset
    let cityLists = this.data.cityLists
    cityLists.list.map((field, index) => field.active = index === params.index ? true : false)
    this.setData({cityLists}, () => {
      if (!cityLists.isLastPage) {
        this.getRecommendCityRangesLists()
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-07-15
   * @detail   清空符合筛选
   * @return   {[type]}   [description]
   */
  reset() {
    let cityLists = this.data.cityLists
    let salaryLists = this.data.salaryLists
    cityLists.list.map(field => field.active = false)
    salaryLists.map(field => field.active = false)
    cityLists.list[0].active = true
    salaryLists[0].active = true
    this.setData({cityLists, salaryLists})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-07-15
   * @detail   执行符合筛选
   * @return   {[type]}   [description]
   */
  search() {
    let cityLists = this.data.cityLists
    let salaryLists = this.data.salaryLists
    let dealMultipleSelection = false
    let resumeList = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      isUse: false,
      showSystemData: false,
      onBottomStatus: 0
    }
    let recommendResumeLists = {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: 0
    }
    let cityItem = cityLists.list.find(field => field.active && field.areaId !== 0)
    let salary = salaryLists.filter(field => field.active && field.id !== 1).map(field => field.id)
    let params = {page: 1}
    if(cityItem || salary.length) {
      dealMultipleSelection = true
    }

    // 已经选择薪资
    if(salary.length) {
      params = Object.assign(params, {salaryIds: salary.join(',')})
      dealMultipleSelection = true
    }

    this.setData({resumeList, dealMultipleSelection, recommendResumeLists}, () => {
      if(this.data.recommended) {
        this.getRecommendResumeLists(params).then(res => {
          let model = this.data.model
          model.show = false
          model.title = ''
          model.type = ''
          this.setData({model})
          wx.removeStorageSync('cacheData')
          // 去获取推荐数据
          if(!this.data.resumeList.list.length) {
            resumeList.showSystemData = true
            this.setData({resumeList}, () => this.getRecommendResumeMoreLists())
          }
        })
      } else {
        this.getRecommendResumePageLists(params).then(res => {
          let model = this.data.model
          model.show = false
          model.title = ''
          model.type = ''
          this.setData({model})
          wx.removeStorageSync('cacheData')
          // 去获取推荐数据
          if(!this.data.resumeList.list.length) {
            resumeList.showSystemData = true
            this.setData({resumeList}, () => this.getRecommendResumeMoreLists())
          }
        })
      }
    })    
  },
  /**
   * @Author   小书包
   * @DateTime 2019-07-13
   * @detail   当推荐任务还没跑完时调用该方法获取简历
   * @return   {[type]}          [description]
   */
  getRecommendResumePageLists(config) {
    let cityItem = this.data.cityLists.list.find(field => field.active)
    let salaryLists = this.data.salaryLists.filter(field => field.active)
    let positionItem = this.data.positionLists.list.find(field => field.active)
    let salaryIds = []
    let resumeList = this.data.resumeList
    let params = {count: 15, page: resumeList.pageNum, ...app.getSource()}

    // 选择了城市
    if(cityItem && cityItem.areaId) {
      params = Object.assign(params, {cityNum: cityItem.areaId})
    }
    // 选择了薪资
    if(salaryLists.length) {
      salaryIds = salaryLists.map(field => field.id).join(',')
      params = Object.assign(params, {salaryIds})
    }
    // 选择了职位
    if(positionItem && positionItem.id) {
      params = Object.assign(params, {positionId: positionItem.id})
    }

    params = Object.assign(params, config)

    return new Promise((resolve, reject) => {
      getRecommendResumePageListsApi(params).then(res => {
        resumeList.onBottomStatus = res.data.length ? 0 : 2
        resumeList.isLastPage = res.data.length ? false : true
        resumeList.pageNum = resumeList.pageNum + 1
        resumeList.isRequire = true
        resumeList.list = resumeList.list.concat(res.data)
        wx.removeStorageSync('cacheData')
        this.setData({resumeList}, () => resolve(res))
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-07-13
   * @detail   获取下一批平台推荐简历
   * @return   {[type]}          [description]
   */
  getRecommendResumeLists(config) {
    let cityItem = this.data.cityLists.list.find(field => field.active)
    let salaryLists = this.data.salaryLists.filter(field => field.active)
    let positionItem = this.data.positionLists.list.find(field => field.active)
    let salaryIds = []
    let resumeList = this.data.resumeList
    let params = {count: 15, page: resumeList.pageNum, ...app.getSource()}

    // 选择了城市
    if(cityItem && cityItem.areaId) {
      params = Object.assign(params, {cityNum: cityItem.areaId})
    }
    // 选择了薪资
    if(salaryLists.length) {
      salaryIds = salaryLists.map(field => field.id).join(',')
      params = Object.assign(params, {salaryIds})
    }
    // 选择了职位
    if(positionItem && positionItem.id) {
      params = Object.assign(params, {positionId: positionItem.id})
    }

    if(resumeList.pageNum === 1) {
      params = Object.assign(params, {isFisrtPage: 1})
    }

    params = Object.assign(params, config)

    return new Promise((resolve, reject) => {
      getRecommendResumeListsApi(params).then(res => {
        resumeList.onBottomStatus = res.data.length ? 0 : 2
        resumeList.isLastPage = res.data.length ? false : true
        resumeList.pageNum = resumeList.pageNum + 1
        resumeList.isRequire = true
        resumeList.list = resumeList.list.concat(res.data)
        wx.removeStorageSync('cacheData')
        this.setData({resumeList}, () => resolve(res))
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-07-13
   * @detail   “为你推荐”列表, 列表数据过少时显示
   * @return   {[type]}   [description]
   */
  getRecommendResumeMoreLists() {
    return new Promise((resolve, reject) => {
      let recommendResumeLists = this.data.recommendResumeLists
      let params = {
        count: this.data.pageCount,
        page: recommendResumeLists.pageNum
      }
      getRecommendResumeMoreListsApi(params).then(res => {
        recommendResumeLists.onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        recommendResumeLists.isLastPage = res.meta.nextPageUrl ? false : true
        recommendResumeLists.pageNum = recommendResumeLists.pageNum + 1
        recommendResumeLists.isRequire = true
        recommendResumeLists.list = recommendResumeLists.list.concat(res.data)
        this.setData({recommendResumeLists}, () => resolve(res))
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-07-13
   * @detail   “为你推荐”列表, 列表数据过少时显示
   * @return   {[type]}   [description]
   */
  getRecommendPositionRangeLists() {
    return new Promise((resolve, reject) => {
      let positionLists = this.data.positionLists
      let item = this.data.positionLists.list.find(field => field.active)
      let params = {
        count: this.data.pageCount,
        page: positionLists.pageNum
      }

      // 在已选职位的情况下
      if(item && item.id) {
        params = Object.assign(params, {positionId: item.id})
      } else {
        delete params.positionId
      }
      getRecommendPositionRangeListsApi(params).then(res => {
        positionLists.onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        positionLists.isLastPage = res.meta.nextPageUrl ? false : true
        positionLists.pageNum = positionLists.pageNum + 1
        positionLists.isRequire = true
        positionLists.list = positionLists.list.concat(res.data)
        this.setData({positionLists}, () => resolve(res))
      })
    })
  },
  onClickSearch(e) {
    let params = e.currentTarget.dataset
    let onLinePosition = this.data.onLinePosition
    onLinePosition.list.map((field, index) => field.active = index === params.index ? true : false)
    this.setData({onLinePosition})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-07-08
   * @detail   选中当前的项
   * @return   {[type]}     [description]
   */
  clickNav(e) {
    let attrData = e.target.dataset
    let navTabIndex = attrData.index
    let className = `.dom${navTabIndex}`
    let params = {page: 1}
    let recommended = this.data.recommended
    let positionLists = this.data.positionLists
    let exclusiveSelection = this.data.exclusiveSelection
    let item = null
    let resumeList = this.data.resumeList
    let recommendResumeLists = this.data.recommendResumeLists
    if(!attrData.isReback) {
      resumeList = {
        list: [],
        pageNum: 1,
        count: 20,
        isLastPage: false,
        isRequire: false,
        onBottomStatus: 0,
        showSystemData: false
      }
      recommendResumeLists = {
        list: [],
        pageNum: 1,
        count: 20,
        isLastPage: false,
        isRequire: false,
        onBottomStatus: 0
      }
    }
    positionLists.list.map((field, index) => {
      field.active = false
      if(navTabIndex === index) {
        field.active = true
        item = field
      }
    })
    recommended = item.recommended
    if(item.id) {
      exclusiveSelection = true
    } else {
      exclusiveSelection = false
    }
    this.setData({navTabIndex, resumeList, recommended, positionLists, exclusiveSelection, recommendResumeLists}, () => {
      // 加上导航滚动特效
      this.getRect(className)
      if(item && item.id) {
        params = Object.assign(params, {positionId: item.id})
      } else {
        delete params.positionId
      }
      if(recommended) {
        if(attrData.isReback === 1) return
        this.getRecommendResumeLists(params).then(res => {
          // 去获取推荐数据
          if(!res.data.length) {
            resumeList.showSystemData = true
            this.setData({resumeList}, () => this.getRecommendResumeMoreLists())
          }
        })
      } else {
        if(attrData.isReback === 1) return
        this.getRecommendResumePageLists(params).then(res => {
          // 去获取推荐数据
          if(!res.data.length) {
            resumeList.showSystemData = true
            this.setData({resumeList}, () => this.getRecommendResumeMoreLists())
          }
        })
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-07-08
   * @detail   获取当前选中的项
   * @return   {[type]}             [description]
   */
  getRect(className) {
    if(!className) return
    getSelectorQuery(className).then(res => {
      let moveParams = this.data.moveParams
      moveParams.subLeft = res.left
      moveParams.subHalfWidth = res.width / 2
      this.moveTo()
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-07-08
   * @detail   控制scroll-view
   * @return   {[type]}     [description]
   */
  scrollViewMove(e) {
    let moveParams = this.data.moveParams
    moveParams.scrollLeft = e.detail.scrollLeft
    this.setData({moveParams: moveParams })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-07-08
   * @detail   移动到指定位置
   * @return   {[type]}   [description]
   */
  moveTo() {
    let subLeft = this.data.moveParams.subLeft
    let screenHalfWidth = this.data.moveParams.screenHalfWidth
    let subHalfWidth = this.data.moveParams.subHalfWidth
    let scrollLeft = this.data.moveParams.scrollLeft
    let distance = subLeft - screenHalfWidth + subHalfWidth
    scrollLeft = scrollLeft + distance
    this.setData({scrollLeft: scrollLeft })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-07-13
   * @detail   获取城市、薪资范围等搜索条件
   * @return   {[type]}   [description]
   */
  getRecommendRangeAll(isReback = 1) {
    let params = {positionCount: this.data.pageCount, cityCount: this.data.pageCount}
    let onBottomStatus = this.data.onBottomStatus
    let salaryLists = this.data.salaryLists
    let recommended = this.data.recommended
    let positionLists = this.data.positionLists
    let cityLists = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: 0
    }
    this.setData({positionLists, cityLists})
    return new Promise((resolve, reject) => {
      getRecommendRangeAllApi(params).then(res => {
        let list = res.data.position || []
        let cacheData = wx.getStorageSync('cacheData')
        let salary = res.data.salary
        let dealMultipleSelection = false
        if(!positionLists.list.length) {
          list.unshift({id: 0, positionName: '全部', active: false, recommended: res.data.recommended})
          positionLists.onBottomStatus = res.data.position.length === this.data.pageCount ? 0 : 2
          positionLists.isLastPage = res.data.position.length === this.data.pageCount ? true : false
          positionLists.list = positionLists.list.concat(list)
          positionLists.pageNum++
          positionLists.isRequire = true
        }
        
        cityLists.onBottomStatus = res.data.position.length === this.data.pageCount ? 0 : 2
        cityLists.isLastPage = res.data.position.length === this.data.pageCount ? true : false
        cityLists.list = cityLists.list.concat(res.data.city || [])
        cityLists.pageNum++
        cityLists.isRequire = true
        cityLists.list.unshift({areaId: 0, name: '全部', active: true })
        salaryLists = res.data.salary
        salaryLists[0].active = true
        recommended = res.data.recommended

        // 已经选择薪资
        if(cacheData && cacheData.salaryIds) {
          salary.map(field => field.active = cacheData.salaryIds.includes(field.id) ? true : false)
          dealMultipleSelection = true
        } else {
          salary[0].active = true
        }

        // 已经选择城市
        if(cacheData && cacheData.areaId) {
          cityLists.list.map(field => field.active = cacheData.areaId === field.areaId ? true : false)
          dealMultipleSelection = true
        } else {
          cityLists.list[0].active = true
        }

        if(recommended) {
          this.getRecommendResumeLists().then(() => {
            let resumeList = this.data.resumeList
            if(!resumeList.list.length) this.getRecommendResumeMoreLists()
          })
        } else {
          this.getRecommendResumePageLists().then(() => {
            let resumeList = this.data.resumeList
            if(!resumeList.list.length) this.getRecommendResumeMoreLists()
          })
        }

        this.setData({positionLists, cityLists, salaryLists, recommended, dealMultipleSelection}, () => resolve(res))
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-07-16
   * @detail   分页获取搜索范围 - 城市
   * @return   {[type]}   [description]
   */
  getRecommendCityRangesLists() {
    let cityLists = this.data.cityLists
    let params = {count: this.data.pageCount, page: cityLists.pageNum, ...app.getSource()}
    return new Promise((resolve, reject) => {
      getRecommendCityRangesListsApi(params).then(res => {
        cityLists.onBottomStatus = res.data.length > this.data.pageCount ? 0 : 2
        cityLists.isLastPage = res.data.length > this.data.pageCount ? false : true
        cityLists.pageNum = cityLists.pageNum + 1
        cityLists.isRequire = true
        cityLists.list = cityLists.list.concat(res.data)
        this.setData({cityLists}, () => resolve(res))
      })
    })
  }
})
