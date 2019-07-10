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

import {
  clearReddotApi
} from '../../../../api/pages/common.js'

import { getRecruiterPositionListApi } from '../../../../api/pages/position.js'

import {RECRUITER, COMMON, APPLICANT, WEBVIEW, VERSION} from '../../../../config.js'

import {getSelectorQuery}  from '../../../../utils/util.js'

import { getPositionListNumApi } from '../../../../api/pages/position.js'


import {
  getAdBannerApi
} from '../../../../api/pages/common'

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
    onLinePosition: {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false
    },
    choseType: '',
    resumeList: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      isUse: false,
      loading: false
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
    }
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
    this.clearOnlineLists()
    if (app.pageInit) {
      userInfo = app.globalData.userInfo
      this.getMixdata()
      if(!wx.getStorageSync('isReback') && !resumeList.list.length) this.getLists()
      wx.removeStorageSync('isReback')
      this.setData({userInfo})
      this.selectComponent('#bottomRedDotBar').init()
      this.getOnlineLists(false)
    } else {
      app.pageInit = () => {
        userInfo = app.globalData.userInfo
        this.getMixdata()
        if(!wx.getStorageSync('isReback') && !resumeList.list.length) this.getLists()
        wx.removeStorageSync('isReback')
        this.setData({userInfo})
        this.selectComponent('#bottomRedDotBar').init()
        this.getOnlineLists(false)
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
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   获取列表数据
   * @return   {[type]}   [description]
   */
  getLists(hasLoading) {
    return this.getResumeList(hasLoading)
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   收集过我的列表
   * @return   {[type]}   [description]
   */
  getResumeList(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let params = {count: this.data.pageCount, page: this.data.resumeList.pageNum, ...app.getSource()}
      let resumeList = this.data.resumeList
      resumeList.loading = true
      this.setData({resumeList})
      getCollectMySelfApi(params, hasLoading).then(res => {
        let onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        let list = res.data
        resumeList.isLastPage = res.meta.nextPageUrl ? false : true
        resumeList.pageNum = resumeList.pageNum + 1
        resumeList.isRequire = true
        resumeList.loading = false
        // list = this.appendData(list, resumeList)
        resumeList.list = resumeList.list.concat(list)
        this.setData({resumeList, onBottomStatus}, () => resolve(res))
      }).catch(() => reject())
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-05-14
   * @detail   追加数据
   * @return   {[type]}   [description]
   */
  // appendData(list, resumeList) {
  //   let detail = this.data.detail
  //   let data = list
  //   let item = {}
  //   if(!resumeList.isUse) {
  //     if(data.length) {
  //       if(!detail.positionNum) item.myType = 1
  //       if(detail.positionNum) item.myType = 2
  //       if(data.length <= 7) {
  //         resumeList.isUse = true
  //         this.setData({resumeList})
  //         data.push(item)
  //       } else {
  //        if(resumeList.isLastPage) {
  //         data.push(item)
  //         resumeList.isUse = true
  //         this.setData({resumeList})
  //        }
  //       }
  //     }
  //   }
  //   return data
  // },
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
    this.setData({hasReFresh: true})
    this.selectComponent('#bottomRedDotBar').init()
    this.getMixdata()
    this.getLists().then(res => {
      let resumeList = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
      let onBottomStatus = res[2].meta && res[2].meta.nextPageUrl ? 0 : 2
      resumeList.list = res[2].data
      resumeList.isLastPage = res[2].meta && res[2].meta.nextPageUrl ? false : true
      resumeList.pageNum = 2
      resumeList.isRequire = true
      resumeList.total = res[2].meta.total
      wx.stopPullDownRefresh()
      this.setData({resumeList, onBottomStatus, fixedDom: false, hasReFresh: false})
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
      this.getLists(false)
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
    let url = '/'+e.currentTarget.dataset.url
    wx.navigateTo({ url })
  },
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
  closeTips() {
    let model = this.data.model
    model.show = false
    this.setData({model})
  },
  sChoice(e) {
    let params = e.currentTarget.dataset
    let onLinePosition = this.data.onLinePosition
    let model = this.data.model
    // let splitArray = [{id: 0, positionName: '全部', active: false }].concat(onLinePosition.list.splice(params.index, 1))
    // onLinePosition.list.shift()

    model.show = false
    onLinePosition.list.map((field, index) => field.active = index === params.index ? true : false)
    // console.log(params.index, splitArray, onLinePosition.list)
    this.setData({onLinePosition, model}, () => this.clickNav({
      target: {
        dataset: {
          index : params.index
        }
      }
    }))
  },
  mChoice(e) {
    let params = e.currentTarget.dataset
    let resumeList = this.data.resumeList
    resumeList.list.map((field, index) => {
      if(index === params.index) field.active = true
    })
    this.setData({resumeList})
  },
  lower(e) {
    console.log(this.data, 'gggggggggggg')
  },
  clearOnlineLists() {
    let onLinePosition = {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false
    }
    this.setData({onLinePosition})
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-27
   * @detail   获取列表数据
   * @return   {[type]}   [description]
   */
  getOnlineLists(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let onLinePosition = this.data.onLinePosition
      let params = {is_online: 1, count: onLinePosition.count, page: onLinePosition.pageNum, hasLoading}
      getRecruiterPositionListApi(params).then(res => {
        let onBottomStatus = !res.meta || !res.meta.nextPageUrl ? 2 : 0
        onLinePosition.list = onLinePosition.list.concat(res.data || [])
        onLinePosition.list.unshift({id: 0, positionName: '全部', active: true })
        onLinePosition.pageNum++
        onLinePosition.isRequire = true
        onLinePosition.isLastPage = !res.meta || !res.meta.nextPageUrl ? true : false
        resolve(res)
        this.setData({onLinePosition, onBottomStatus})
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
    let className = `.dom${e.target.dataset.index}`
    this.setData({navTabIndex: e.target.dataset.index }, () => this.getRect(className))
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
  }
})
