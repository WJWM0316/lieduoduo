import {
  getBrowseMySelfListsApi,
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
    barLists: [],
    // 是否第一页，是1，否0，默认为0，当设置了薪资参数时，该参数无效
    isFisrtPage: 1,
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
    dealMultipleSelection: false
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
    let resumeList = this.data.resumeList
    let userInfo = app.globalData.userInfo
    this.getDomNodePosition()
    this.initDefaultBar()
    if (app.pageInit) {
      userInfo = app.globalData.userInfo
      this.getMixdata()
      this.getRecommendRangeAll()
      this.setData({userInfo})
      this.selectComponent('#bottomRedDotBar').init()
    } else {
      app.pageInit = () => {
        userInfo = app.globalData.userInfo
        this.getMixdata()
        this.getRecommendRangeAll()
        this.setData({userInfo})
        this.selectComponent('#bottomRedDotBar').init()
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
  getDomNodePosition() {
    setTimeout(() => {
      getSelectorQuery('.default').then(res => {
        if(!fixedDomPosition) fixedDomPosition = res.top - this.data.navH
      })
    }, 1000)
  },
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
    let resumeList = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      isUse: false,
      showSystemData: false,
      onBottomStatus: 0
    }
    this.setData({hasReFresh: true, resumeList})
    this.selectComponent('#bottomRedDotBar').init()
    this.getMixdata()
    this.getRecommendRangeAll().then(() => {
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
    if (!this.data.resumeList.isLastPage) {
      this.setData({onBottomStatus: 1})
      if(this.data.recommended) {
        this.getRecommendResumeLists()
      } else {
        this.getRecommendResumePageLists()
      }
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
      wx.setStorageSync('isReback', 'yes')
      wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${uid}`})
    } else {
      wx.setStorageSync('isReback', 'yes')
      if(params.type === 'clearRedDot') {
        clearReddotApi({jobHunterUid: params.jobhunteruid, reddotType: 'red_dot_recruiter_view_item'}).then(() => {
          wx.navigateTo({url: `${COMMON}resumeDetail/resumeDetail?uid=${params.jobhunteruid}`})
        })
      } else {
        wx.navigateTo({url: `${COMMON}resumeDetail/resumeDetail?uid=${params.jobhunteruid}`})
      }
    }
  },
  routeJump(e) {
    let route = e.currentTarget.dataset.route
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
    let barLists = this.data.barLists
    let model = this.data.model
    model.show = false
    positionLists.list.map((field, index) => field.active = index === params.index ? true : false)
    let item = positionLists.list.find(field => field.active)
    barLists.map((field, index) => {
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
    this.setData({positionLists, model, barLists})
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
    let item = salaryLists[params.index]
    let mark = 1
    if(item.id === mark) {
      if(item.active) {
        salaryLists.map(field => field.active = false)
      } else {
        salaryLists.map(field => field.active = true)
      }
    } else {
      salaryLists[params.index].active = !salaryLists[params.index].active
      let tem = salaryLists.filter(field => field.id !== mark)
      let filter = tem.filter(field => field.active)
      if(tem.length === filter.length) {
        salaryLists.map(field => field.active = true)
      } else {
        salaryLists.map(field => {if(field.id === mark) {field.active = false}})
      }
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
    let dealMultipleSelection = this.data.dealMultipleSelection
    let resumeList = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      isUse: false,
      showSystemData: false,
      onBottomStatus: 0
    }
    let cityItem = cityLists.list.find(field => field.active)
    let salary = salaryLists.filter(field => field.active).map(field => field.id)
    let params = {page: 1}
    if(cityItem || salary.length) {
      dealMultipleSelection = true
    }

    // 已经选择薪资
    if(salary.length) {
      if(salary.includes(1)) {
        params = Object.assign(params, {salaryIds: 1})
      } else {
        params = Object.assign(params, {salaryIds: salary.join(',')})
      }
    }

    this.setData({resumeList, dealMultipleSelection}, () => {
      if(this.data.recommended) {
        this.getRecommendResumeLists(params).then(res => {
          let model = this.data.model
          model.show = false
          model.title = ''
          model.type = ''
          this.setData({model})
        })
      } else {
        this.getRecommendResumePageLists(params).then(res => {
          let model = this.data.model
          model.show = false
          model.title = ''
          model.type = ''
          this.setData({model})
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
    let params = {count: this.data.pageCount, page: resumeList.pageNum, ...app.getSource()}

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
    if(positionItem) {
      params = Object.assign(params, {positionId: positionItem.id})
    }

    if(resumeList.pageNum === 1) {
      params = Object.assign(params, {isFisrtPage: 1})
    }

    params = Object.assign(params, config)

    return new Promise((resolve, reject) => {
      getRecommendResumePageListsApi(params).then(res => {
        resumeList.onBottomStatus = res.data.length > this.data.pageCount ? 0 : 2
        resumeList.isLastPage = res.data.length > this.data.pageCount ? false : true
        resumeList.pageNum = resumeList.pageNum + 1
        resumeList.isRequire = true
        resumeList.list = resumeList.list.concat(res.data)
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
    let params = {count: this.data.pageCount, page: resumeList.pageNum, ...app.getSource()}

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
    if(positionItem) {
      params = Object.assign(params, {positionId: positionItem.id})
    }

    params = Object.assign(params, config)

    return new Promise((resolve, reject) => {
      getRecommendResumeListsApi(params).then(res => {
        resumeList.onBottomStatus = res.data.length > this.data.pageCount ? 0 : 2
        resumeList.isLastPage = res.data.length > this.data.pageCount ? false : true
        resumeList.pageNum = resumeList.pageNum + 1
        resumeList.isRequire = true
        resumeList.list = resumeList.list.concat(res.data)
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
      let barLists = this.data.barLists
      let item = barLists.find(field => field.active)
      let params = {
        count: this.data.pageCount,
        page: recommendResumeLists.pageNum
      }

      // 在已选职位的情况下
      if(item && item.id) {
        params = Object.assign(params, {positionId: item.id})
      } else {
        delete params.positionId
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
      let item = this.data.barLists.find(field => field.active)
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
    let navTabIndex = e.target.dataset.index
    let className = `.dom${navTabIndex}`
    let barLists = this.data.barLists
    let params = {page: 1}
    let recommended = this.data.recommended
    let positionLists = this.data.positionLists
    let exclusiveSelection = this.data.exclusiveSelection
    let resumeList = {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: 0,
      showSystemData: false
    }
    barLists.map((field, index) => field.active = navTabIndex === index ? true : false)
    let item = barLists.find(field => field.active)
    positionLists.list.map(field => field.active = field.id === item.id)
    if(item.id) {
      recommended = item.recommended
      exclusiveSelection = true
    } else {
      exclusiveSelection = false
    }
    this.setData({navTabIndex, barLists, resumeList, recommended, positionLists, exclusiveSelection}, () => {
      // 加上导航滚动特效
      this.getRect(className)
      if(item && item.id) {
        params = Object.assign(params, {positionId: item.id})
      } else {
        delete params.positionId
      }
      if(recommended) {
        this.getRecommendResumeLists(params).then(res => {
          // 去获取推荐数据
          if(!res.data.length) {
            resumeList.showSystemData = true
            this.setData({resumeList}, () => this.getRecommendResumeMoreLists())
          }
        })
      } else {
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
  getRecommendRangeAll() {
    let params = {positionCount: this.data.pageCount, cityCount: this.data.pageCount}
    let onBottomStatus = this.data.onBottomStatus
    let barLists = this.data.barLists
    let salaryLists = this.data.salaryLists
    let recommended = this.data.recommended
    let positionLists = {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: 0
    }
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
        positionLists.onBottomStatus = res.data.position.length < 20 ? 2 : 0
        positionLists.isLastPage = res.data.position.length < 20 ? true : false
        positionLists.list = positionLists.list.concat(res.data.position || [])
        positionLists.pageNum++
        positionLists.isRequire = true
        cityLists.onBottomStatus = res.data.position.length < 20 ? 2 : 0
        cityLists.isLastPage = res.data.position.length < 20 ? true : false
        cityLists.list = cityLists.list.concat(res.data.city || [])
        cityLists.pageNum++
        cityLists.isRequire = true
        cityLists.list.unshift({areaId: 0, name: '全部', active: false })
        salaryLists = res.data.salary
        barLists = res.data.position || []
        barLists.unshift({id: 0, positionName: '全部', active: true })
        recommended = res.data.recommended
        if(recommended) {
          this.getRecommendResumeLists()
        } else {
          this.getRecommendResumePageLists()
        }
        this.setData({positionLists, cityLists, salaryLists, barLists, recommended}, () => resolve(res))
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
    let positionItem = this.data.barLists.find(field => field.active)
    let cityLists = this.data.cityLists
    let params = {count: this.data.pageCount, page: citylists.pageNum, ...app.getSource()}

    // 选择了城市
    if(positionItem && positionItem.id) {
      params = Object.assign(params, {positionId: positionItem.id})
    } else {
      delete params.positionId
    }

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
