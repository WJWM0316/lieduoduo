import {RECRUITER, APPLICANT, COMMON} from '../../../../config.js'
import {getSelectorQuery}  from '../../../../utils/util.js'
import { getAvartListApi } from '../../../../api/pages/active.js'
import { getPositionSchListApi, getPositionRecordApi, getRecommendApi } from '../../../../api/pages/position.js'
import {getFilterDataApi} from '../../../../api/pages/aggregate.js'
import {getAdBannerApi} from '../../../../api/pages/common'
import {shareChance} from '../../../../utils/shareWord.js'
import {agreedTxtB} from '../../../../utils/randomCopy.js'

const app = getApp()
let identity = '',
    hasOnload = false, // 用来判断是否执行了onload，就不走onShow的校验
    tabTop = 0,
    timer = null,
    adPositionIds = null
Page({
  data: {
    pageCount: app.globalData.pageCount,
    navH: app.globalData.navHeight,
    hasReFresh: false,
    hideLoginBox: true,
    background: 'transparent',
    isBangs: app.globalData.isBangs, // 是否有齐刘海
    filterList: {
      list: [],
      pageNum: 0,
      onBottomStatus: 0,
      isLastPage: false,
      isRequire: false
    },
    recommendList: {
      list: [],
      pageNum: 0,
      onBottomStatus: 0,
      isLastPage: false,
      isRequire: false
    },
    bannerIndex: 0,
    bannerList: [],
    moreRecruiter: [],
    bannerH: 200,
    requireOAuth: false,
    cdnImagePath: app.globalData.cdnImagePath,
    userInfo: app.globalData.userInfo,
    options: {},
    hasExpect: 1,
    recommended: 0, // 是否有推荐策略
    getRecommend: 0, // 过滤数据完毕开始加载推荐疏数据
    filterResult: {}, // 筛选项结果 
    filterType: '', // 筛选类型
    openPop: false // 过滤组件开关
  },
  onLoad(options) {
    app.toastSwitch()
    hasOnload = false
    adPositionIds = null
    
    if (options.needAuth && wx.getStorageSync('choseType') === 'RECRUITER') { // 是否从不服来赞过来的B身份 强制C端身份
      wx.setStorageSync('choseType', 'APPLICANT')
    }
    identity = app.identification(options)
    this.setData({options})
    let init = () => {
      this.getAdBannerList()
      this.getAvartList()
      this.getFilterData().then(() => {
        this.getRecord()
        hasOnload = true
        if (app.getRoleInit) {
          this.initPage()
        } else {
          app.getRoleInit = () => {
            this.initPage()
          }
        }
      })
    }
    if (app.loginInit) {
      init()
    } else {
      app.loginInit = () => {
        init()
      }
    }
  },
  onUnload () {
  },
  onShow (options) {
    if (hasOnload) {
      this.initPage()
    }
    let init = () => {
      app.wxReportAnalytics('enterPage_report', {
        haslogin: app.globalData.hasLogin,
        isjobhunter: app.globalData.isJobhunter,
        userinfo: app.globalData.userInfo ? 1 : 0
      })
      this.setData({userInfo: app.globalData.userInfo})
      let bannerList = this.data.bannerList
      if (app.globalData.isJobhunter && bannerList.length > 0 && bannerList[bannerList.length - 1].smallImgUrl === 'https://attach.lieduoduo.ziwork.com/front-assets/images/banner_resume.png') {
        bannerList.splice(bannerList.length - 1, 1)
        this.setData({bannerList, bannerIndex: 0})
      }
      if (app.pageInit) {
        this.selectComponent('#bottomRedDotBar').init()
        this.setData({hasExpect: app.globalData.hasExpect})
      } else {
        app.pageInit = () => {
          this.selectComponent('#bottomRedDotBar').init()
          this.setData({hasExpect: app.globalData.hasExpect})
        }
      }
    }
    if (app.getRoleInit) {
      init()
    } else {
      app.getRoleInit = () => {
        init()
      }
    }
  },
  initPage () {
    let jumpCreate = () => {
      if (!app.globalData.isMicroCard && wx.getStorageSync('choseType') !== 'RECRUITER') {
        app.wxToast({
          title: '前往求职飞船',
          icon: 'loading',
          callback () {
            wx.reLaunch({
              url: `${APPLICANT}createUser/createUser?micro=true`
            })
          }
        })
      }
    }
    if (!app.globalData.hasLogin) {
      this.setData({hideLoginBox: false})
    } else {
      let timer = setTimeout(() => {
        jumpCreate()
        clearTimeout(timer)
      }, 500)
    }
  }, 
  getAvartList() {
    getAvartListApi().then(res => {
      const moreRecruiter = res.data.moreRecruiter
      this.setData({moreRecruiter})
    })
  },
  toMore () {
    wx.navigateTo({
      url: `${COMMON}rank/rank`
    })
  },
  autoplay (e) {
    this.setData({bannerIndex: e.detail.current})
  },
  jumpBanner (e) {
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: `/${url}`
    })
  },
  getFilterData () {
    return getFilterDataApi().then(res => {
      let cityList = res.data.area,
          positionTypeList = res.data.label,
          emolumentList = res.data.emolument
      positionTypeList.map(field => field.active = false)
      this.setData({cityList, positionTypeList, emolumentList})
    })
  },
  getFilterResult (e) {
    let filterResult = e.detail
    this.setData({filterResult}, () => {
      this.reloadPositionLists()
    })
  },
  chooseType (e) {
    let type = e.currentTarget.dataset.type
    this.setData({filterType: type, openPop: true})
  },
  getRecord() {
    return getPositionRecordApi().then(res => {
      if (res.data.recommended) {
        recommended = res.data.recommended
      }
      this.setData({recommended}, () => {
        this.reloadPositionLists()
      })
    }).catch(e => {
      this.reloadPositionLists()
    })
  },
  getPositionList(hasLoading = true) {
    let listData = null,
        listType = null,
        getList = null,
        params = {count: this.data.pageCount, recordParams: 1, ...this.data.filterResult, ...app.getSource()}
    if ((this.data.recommended && !params.cityNums && !params.positionTypeIds) || this.data.getRecommend) {
      getList = getRecommendApi
      params.count = 20
      listData = this.data.recommendList
      listType = 'recommendList'
      params.adPositionIds = adPositionIds
      if (params.page === 1) params.isFisrtPage = 1
    } else {
      listData = this.data.filterList
      getList = getPositionSchListApi
      listType = 'filterList'
    }
    listData.pageNum++
    params.page = listData.pageNum
    if (this.data.options.positionTypeId) {
      params.recordParams = 0
      delete params.cityNums
      delete params.emolumentIds
    }
    
    return getList(params, hasLoading).then(res => {
      let requireOAuth = false
      if (res.meta && res.meta.requireOAuth) requireOAuth = res.meta.requireOAuth
      if (this.data.options.needAuth && !app.globalData.userInfo) {
        requireOAuth = true
      }
      if (res.meta && res.meta.adPositionIds) adPositionIds = res.meta.adPositionIds
      listData.list.push(res.data)
      listData.isLastPage = res.data.length < 20 || (res.meta && res.meta.currentPage && parseInt(res.meta.currentPage) === res.meta.lastPage) ? true : false
      listData.isRequire = true
      listData.onBottomStatus = listData.isLastPage ? 2 : 0
      this.setData({[`${listType}`]: listData, requireOAuth}, () => {
        if (app.globalData.haslogin && !this.data.recommendList.isRequire && this.data.filterList.isRequire && this.data.filterList.isLastPage && (!this.data.recommended || params.cityNums || params.positionTypeIds)) {
          this.setData({getRecommend: 1}, () => {
            this.getPositionList(false)
          })
        }
      })
    })
  },
  getAdBannerList () {
    getAdBannerApi().then(res => {
      let list = res.data
      // 没有创建简历的 新增一个banner位
      if (!app.globalData.isJobhunter) {
        list.push({
          bigImgUrl: "https://attach.lieduoduo.ziwork.com/front-assets/images/banner_resumeX.png",
          smallImgUrl:"https://attach.lieduoduo.ziwork.com/front-assets/images/banner_resume.png",
          targetUrl:`page/applicant/pages/createUser/createUser?from=3`,
          type: 'create'
        })
      }
      this.setData({bannerList: list})
      wx.nextTick(() => {
        getSelectorQuery('.banner').then(res => {
          let bannerH = res.height
          this.setData({bannerH})
        })
        getSelectorQuery('.select-box').then(res => {
          tabTop = res.top - res.height
        })
      })
    })
  },
  authSuccess() {
    let requireOAuth = false
    this.setData({requireOAuth})
  },
  addIntention () {
    let data = this.data,
        salaryFloor = 0,
        salaryCeil = 0
    switch (data.emolument) {
      case 1:
        salaryFloor = 0
        salaryCeil = 0
        break
      case 2:
        salaryFloor = 1
        salaryCeil = 2
        break
      case 3:
        salaryFloor = 3
        salaryCeil = 6
        break
      case 4:
        salaryFloor = 5
        salaryCeil = 10
        break
      case 5:
        salaryFloor = 10
        salaryCeil = 20
        break
      case 6:
        salaryFloor = 15
        salaryCeil = 30
        break
      case 7:
        salaryFloor = 20
        salaryCeil = 40
        break
      case 8:
        salaryFloor = 50
        salaryCeil = 100
        break
    }
    let lntention = {
      city: data.city,
      cityName: data.cityList[data.cityIndex].name,
      provinceName: data.cityList[data.cityIndex].provinceName,
      positionType: data.type,
      positionName: data.positionTypeList[data.typeIndex].name,
      salaryFloor: salaryFloor,
      salaryCeil: salaryCeil
    }
    if (data.positionTypeList[data.typeIndex].pid === data.positionTypeList[data.typeIndex].topPid) {
      lntention.positionType = 0
      lntention.positionName = ''
    }
    wx.setStorageSync('addIntention', lntention)
    wx.navigateTo({
      url: `/page/applicant/pages/center/resumeEditor/aimsEdit/aimsEdit`
    })
  },
  reloadPositionLists(hasLoading = true) {
    const filterList = {list: [], pageNum: 0, isLastPage: false, isRequire: false},
          recommendList = {list: [], pageNum: 0, isLastPage: false, isRequire: false}
    this.setData({filterList, recommendList})
    return this.getPositionList(hasLoading)
  },
  onPageScroll(e) {
    if (e.scrollTop > 0) {
      if (this.data.background !== '#652791') this.setData({background: '#652791'})
    } else {
      if (this.data.background === '#652791') this.setData({background: 'transparent'})
    }
    if (e.scrollTop > tabTop) {
      if (!this.data.tabFixed) this.setData({tabFixed: true})
    } else {
      if (this.data.tabFixed) this.setData({tabFixed: false})
    }
  },
  onPullDownRefresh() {
    this.selectComponent('#bottomRedDotBar').init()
    this.reloadPositionLists(false).then(res => {
      this.setData({hasReFresh: false})
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom() {
    let listType = null
    if ((this.data.recommended && !this.data.city && !this.data.type) || this.data.getRecommend) {
      listType = 'recommendList'
    } else {
      listType = 'filterList'
    }
    if (this.data[listType].isLastPage) return
    this.setData({[`${listType}.onBottomStatus`]: 1})
    this.getPositionList(false)
  },
  onShareAppMessage(options) {
　　return app.wxShare({
      options,
      title: shareChance,
      path: `${APPLICANT}index/index`
    })
  }
})
