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
    adPositionIds = null,
    filterData = {}
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
      // 如果已创建了，需要删除引导创建banner
      let bannerList = this.data.bannerList
      if (app.globalData.isJobhunter && bannerList.length > 0 && bannerList[bannerList.length - 1].type === 'create') {
        bannerList.splice(bannerList.length - 1, 1)
        let background = null
        if (!bannerList.length)  background = '#652791'
        this.setData({bannerList, bannerIndex: 0, background})
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
      timer = setTimeout(() => {
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
      filterData = res.data
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
      let recommended = false,
          filterResult = res.data
      // 没有topId, 根据规则自己造一个
      if (!filterResult.topId && filterResult['positionTypeIds']) filterResult.topId = filterResult['positionTypeIds'].slice(0, 2) + '0000'

      // 没有职位列表名称
      if (!filterResult['positionTypeName'] && filterResult['positionTypeIds']) {
        let array  = filterData['positionType'].filter(item => { return item.labelId === parseInt(filterResult.topId)})
        array[0].children.filter(item => {
          if (item.labelId === parseInt(filterResult['positionTypeIds'])) {
            filterResult['positionTypeName'] = item.name
          }
        })
      }
      
      // 没有城市名，自己造一个
      if (!filterResult.cityName && filterResult.cityNums) {
        let array = filterData['area'].filter(item => { return item.areaId === parseInt(filterResult.cityNums)})
        filterResult.cityName =  array[0] && array[0].name || ''
      }

      if (filterResult.recommended) recommended = filterResult.recommended
      this.setData({recommended, filterResult}, () => {
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
    // 除了薪资范围，选择其余筛选条件都是请求正常数据列表，否则请求推荐列表
    let canRecommend = params.recommended && 
                       !params.cityNums && 
                       !params.positionTypeIds && 
                       !params.industryIds && 
                       !params.employeeIds && 
                       !params.financingIds
    
    if (canRecommend || this.data.getRecommend) {
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

    // 从职位详情过来的推荐数据 不需要记录且不需要其他条件
    if (this.data.options.positionTypeId) {
      params.positionTypeIds = this.data.options.positionTypeId
      params.recordParams = 0
      delete params.cityNums
      delete params.emolumentIds
      delete params.industryIds
      delete params.employeeIds
      delete params.financingIds
    }

    // 加载完正常列表 再加载的推荐数据不需要传薪资条件
    if (this.data.getRecommend) {
      params.recordParams = 0
      delete params.emolumentIds
    }
      
    return getList(params, hasLoading).then(res => {
      let requireOAuth = false
      if (res.meta && res.meta.requireOAuth) requireOAuth = res.meta.requireOAuth
      if (this.data.options.needAuth && !app.globalData.userInfo) {
        requireOAuth = true
      }
      if (res.meta && res.meta.adPositionIds) adPositionIds = res.meta.adPositionIds

      let isLastPage     = res.data.length < 20 || (res.meta && res.meta.currentPage && parseInt(res.meta.currentPage) === res.meta.lastPage) ? true : false
      let isRequire      = true
      let onBottomStatus = isLastPage ? 2 : 0
      let setData = {
        [`${listType}.pageNum`]: listData.pageNum,
        [`${listType}.isLastPage`]: isLastPage, 
        [`${listType}.isRequire`]: isRequire, 
        [`${listType}.onBottomStatus`]: onBottomStatus, 
        requireOAuth
      }

      if (res.data.length) setData[`${listType}.list`] = res.data
      this.setData(setData, () => {
        if (app.globalData.hasLogin && 
            !this.data.recommendList.isRequire && 
            this.data.filterList.isRequire && 
            this.data.filterList.isLastPage) {
          this.setData({getRecommend: 1}, () => {
            this.getPositionList(false)
          })
        }
      })
      if (!this.data.bannerList.length && listData.pageNum === 1) this.getAdBannerList()
    })
  },
  getAdBannerList () {
    getAdBannerApi().then(res => {
      let list = res.data
      // 没有创建简历的 新增一个banner位
      if (!app.globalData.isJobhunter) {
        let item = {
          bigImgUrl: "https://attach.lieduoduo.ziwork.com/front-assets/images/banner_resumeX.png",
          smallImgUrl:"https://attach.lieduoduo.ziwork.com/front-assets/images/banner_resume.png",
          targetUrl: `page/applicant/pages/createUser/createUser?from=3&fromType=guideCard&firstIndex=0&secondIndex=6`,
          type: 'create'
        }
        if (this.data.filterList.list.length > 6 || this.data.recommendList.list.length > 6) {
          item.targetUrl = `page/applicant/pages/createUser/createUser?from=3&fromType=guideCard&firstIndex=0&secondIndex=6`
        } else {
          if (this.data.filterList.list.length > 0) {
            item.targetUrl = `page/applicant/pages/createUser/createUser?from=3&fromType=guideCard&firstIndex=0&secondIndex=${this.data.filterList.list.length}`
          } else if (this.data.recommendList.list.length > 0) {
            item.targetUrl = `page/applicant/pages/createUser/createUser?from=3&fromType=guideCard&firstIndex=0&secondIndex=${this.data.recommendList.list.length}`
          }
        }
        list.push(item)
      }
      let background = this.data.background
      if (!list.length && this.data.background !== '#652791')  background = '#652791'
      this.setData({bannerList: list, background}, () => {
        if (list.length) {
          getSelectorQuery('.banner').then(res => {
            let bannerH = res.height
            this.setData({bannerH})
          })
        }
      })
      getSelectorQuery('.select-box').then(res => {
        tabTop = res.top - res.height
      })
    })
  },
  authSuccess() {
    let requireOAuth = false
    this.setData({requireOAuth})
  },
  addIntention () {
    let data = this.data.filterResult,
        salaryFloor = 0,
        salaryCeil = 0
    if (data.employeeIds) {
      switch (Math.max(...data.employeeIds.split(','))) {
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
    }
    let lntention = {
      city: data.cityNums,
      cityName: data.cityName,
      positionType: data.positionTypeIds,
      salaryFloor: salaryFloor,
      salaryCeil: salaryCeil
    }
    filterData['area'].filter(item => {
      if (item.areaId === parseInt(data.cityNums)) {
        lntention.provinceName = item.provinceName
      }
    })
    let array = filterData['positionType'].filter(item => { return item.labelId === parseInt(data.topId)})
    array[0].children.filter(item => {
      if (item.labelId === parseInt(data.positionTypeIds)) {
        lntention.positionName = item.name
      }
    })
    wx.setStorageSync('addIntention', lntention)
    wx.navigateTo({
      url: `/page/applicant/pages/center/resumeEditor/aimsEdit/aimsEdit`
    })
  },
  reloadPositionLists(hasLoading = true) {
    const filterList = {list: [], pageNum: 0, isLastPage: false, isRequire: false},
          recommendList = {list: [], pageNum: 0, isLastPage: false, isRequire: false}
    this.setData({filterList, recommendList, getRecommend: 0})
    return this.getPositionList(hasLoading)
  },
  routeJump (e) {
    let route = e.currentTarget.dataset.route
    switch (route) {
      case 'specialJob':
        wx.reLaunch({url: `${APPLICANT}specialJob/specialJob`})
        break
    }
  },
  onPageScroll(e) {
    if (e.scrollTop > 0) {
      if (this.data.background !== '#652791') this.setData({background: '#652791'})
    } else {
      if (this.data.bannerList.length && this.data.background === '#652791') {
        this.setData({background: 'transparent'})
      }
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
    let listType = null,
        filterResult = this.data.filterResult,
        canRecommend = filterResult.recommended && 
                       !filterResult.cityNums && 
                       !filterResult.positionTypeIds && 
                       !filterResult.industryIds && 
                       !filterResult.employeeIds && 
                       !filterResult.financingIds
    if (canRecommend || this.data.getRecommend) {
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
