
import {RECRUITER, APPLICANT, COMMON} from '../../../../config.js'

import {getSelectorQuery}  from '../../../../utils/util.js'
import { getAvartListApi } from '../../../../api/pages/active.js'

import { getPositionListApi, getPositionRecordApi, getEmolumentApi } from '../../../../api/pages/position.js'

import {
  getCityLabelApi,
  getAdBannerApi
} from '../../../../api/pages/common'

import {
  getLabelPositionApi
} from '../../../../api/pages/label.js'

import {shareChance} from '../../../../utils/shareWord.js'

const app = getApp()
let identity = '',
    hasOnload = false // 用来判断是否执行了onload，就不走onShow的校验
Page({
  data: {
    pageCount: 20,
    navH: app.globalData.navHeight,
    showNav: false,
    fixedBarHeight: 0,
    hasReFresh: false,
    onBottomStatus: 0,
    hideLoginBox: true,
    isBangs: app.globalData.isBangs,
    pixelRatio: app.globalData.systemInfo.pixelRatio,
    bannerH: 200,
    tabList: [
      {
        name: '工作城市',
        type: 'city',
        active: false
      },
      {
        name: '职位类型',
        type: 'positionType',
        active: false
      },
      {
        name: '薪资范围',
        type: 'salary',
        active: false
      }
    ],
    positionList: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    },
    bannerIndex: 0,
    bannerList: [],
    moreRecruiter: [],
    tabType: 'closeTab',
    city: 0,
    cityIndex: 0,
    type: 0,
    typeIndex: 0,
    emolument: 1,
    emolumentIndex: 0,
    cityList: [],
    positionTypeList: [],
    emolumentList: [],
    requireOAuth: false,
    cdnImagePath: app.globalData.cdnImagePath,
    options: {}
  },
  onLoad(options) {
    hasOnload = false
    let bannerH = this.data.bannerH,
        requireOAuth = this.data.requireOAuth
    console.log(options, 1111111111111111111)
    if (!this.data.isBangs) {
      bannerH = app.globalData.systemInfo.screenWidth/(750/420)
    } else {
      bannerH = app.globalData.systemInfo.screenWidth/(750/468)
    }
    identity = app.identification(options)
    const positionList = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    }
    this.setData({positionList, bannerH, options})
    let init = () => {
      this.getAdBannerList()
      this.getAvartList()
      Promise.all([this.getCityLabel(), this.getLabelPosition(), this.getEmolument()]).then(() => {
        this.getPositionRecord()
        hasOnload = true
        this.initPage()
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
  onShow () {
    if (hasOnload) {
      this.initPage()
    }
  },
  onShow (options) {
    if (hasOnload) {
      this.initPage()
    }
    if (wx.getStorageSync('choseType') === 'RECRUITER') {
      app.wxConfirm({
        title: '提示',
        content: '检测到你是招聘官，是否切换招聘端',
        confirmBack() {
          wx.reLaunch({
            url: `${RECRUITER}index/index`
          })
        },
        cancelBack() {
          wx.setStorageSync('choseType', 'APPLICANT')
          app.getAllInfo()
        }
      })
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
  /**
   * @Author   小书包
   * @DateTime 2019-01-24
   * @detail   获取热门城市
   * @return   {[type]}   [description]
   */
  getCityLabel() {
    return getCityLabelApi().then(res => {
      const cityList = res.data
      cityList.unshift({areaId: '', name: '全部'})
      this.setData({cityList})
    })
  },
  choseTab (e) {
    let closeTab = e.currentTarget.dataset.type
    if (this.data.tabType === closeTab || closeTab === 'closeTab') {
      this.setData({tabType: 'closeTab'})
    } else {
      this.setData({tabType: closeTab})
    }
  },
  toggle (e) {
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    let name = e.currentTarget.dataset.name
    let tabList = this.data.tabList
    switch (this.data.tabType) {
      case 'city':
        if (index === 0) {
          tabList[0].name = '工作城市'
          tabList[0].active = false
        } else {
          tabList[0].active = true
          tabList[0].name = name
        }
        this.setData({tabList, city: id, cityIndex: index, tabType: 'closeTab'})
        this.reloadPositionLists()
        break
      case 'positionType':
        if (index === 0) {
          tabList[1].name = '职位类型'
          tabList[1].active = false
        } else {
          tabList[1].active = true
          tabList[1].name = name
        }
        this.setData({tabList, type: id, typeIndex: index, tabType: 'closeTab'})
        this.reloadPositionLists()
        break
      case 'salary':
        if (index === 0) {
          tabList[2].name = '薪资范围'
          tabList[2].active = false
        } else {
          tabList[2].active = true
          tabList[2].name = name
        }
        this.setData({tabList, emolument: id, emolumentIndex: index, tabType: 'closeTab'})
        this.reloadPositionLists()
        break
    }
    if (this.data.tabFixed) this.setData({tabFixed: false})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-23
   * @detail   获取技能标签
   * @return   {[type]}   [description]
   */
  getLabelPosition() {
    return getLabelPositionApi().then(res => {
      const positionTypeList = res.data
      positionTypeList.map(field => field.active = false)
      positionTypeList.unshift({
        labelId: '',
        name: '全部',
        type: 'self_label_position'
      })
      this.setData({positionTypeList})
    })
  },
  getPositionRecord() {
    return getPositionRecordApi().then(res => {
      let city = this.data.city
      let type = this.data.type
      let emolument = this.data.emolument
      let cityIndex = this.data.cityIndex
      let typeIndex = this.data.typeIndex
      let emolumentIndex = this.data.emolumentIndex
      let tabList = this.data.tabList
      if (res.data.city) {
        city = Number(res.data.city)
        this.data.cityList.map((item, index) => {
          if (item.areaId === city) {
            cityIndex = index
            if (index === 0) {
              tabList[0].name = '工作城市'
            } else {
              tabList[0].active = true
              tabList[0].name = item.name
            }
          }
        })
      }
      if (res.data.type) {
        type = Number(res.data.type)
        this.data.positionTypeList.map((item, index) => {
          if (item.labelId === type) {
            typeIndex = index
            if (index === 0) {
              tabList[1].name = '职位类型'
            } else {
              tabList[1].active = true
              tabList[1].name = item.name
            }
          }
        })
      }
      if (res.data.emolumentId) {
        emolument = Number(res.data.emolumentId)
        this.data.emolumentList.map((item, index) => {
          if (item.id === emolument) {
            emolumentIndex = index
            if (index === 0) {
              tabList[2].name = '薪资范围'
            } else {
              tabList[2].active = true
              tabList[2].name = item.text
            }
          }
        })
      }
      this.setData({tabList, city, type, cityIndex, typeIndex, emolument, emolumentIndex}, () => {
        this.getPositionList()
      })  
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   获取职位列表
   * @return   {[type]}   [description]
   */
  getPositionList(hasLoading = true) {
    let params = {count: this.data.pageCount, page: this.data.positionList.pageNum, ...app.getSource()}
    if(this.data.city) {
      params = Object.assign(params, {city: this.data.city})
    }
    if(this.data.type) {
      params = Object.assign(params, {type: this.data.type})
    }
    if (this.data.emolument) {
      params = Object.assign(params, {emolument_id: this.data.emolument})
    }
    if(!this.data.type) {
      delete params.type
    }
    if(!this.data.city) {
      delete params.city
    }
    if(!this.data.emolument) {
      delete params.emolument_id
    }
    return getPositionListApi(params, hasLoading).then(res => {
      let positionList = this.data.positionList
      let onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
      let requireOAuth = res.meta.requireOAuth || false
      if (this.data.options.needAuth && !app.globalData.userInfo) requireOAuth = true
      positionList.list = positionList.list.concat(res.data)
      positionList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
      positionList.pageNum = positionList.pageNum + 1
      positionList.isRequire = true       
      this.setData({positionList, requireOAuth, onBottomStatus})
    })
  },
  getAdBannerList () {
    getAdBannerApi().then(res => {
      this.setData({bannerList: res.data})
    })
  },
  getEmolument () {
    getEmolumentApi().then(res => {
      this.setData({emolumentList: res.data})
    })
  },
  authSuccess() {
    let requireOAuth = false
    this.setData({requireOAuth})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-24
   * @detail   刷新数据
   * @return   {[type]}   [description]
   */
  reloadPositionLists(hasLoading = true) {
    const positionList = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
    this.setData({positionList})
    return this.getPositionList()
  },
  onPageScroll(e) {
    if (e.scrollTop > 0) {
      if (e.scrollTop > 210 + this.data.navH) {
        if (!this.data.tabFixed) this.setData({tabFixed: true})
      } else {
        if (this.data.tabFixed) this.setData({tabFixed: false})
      }
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   下拉重新获取数据
   * @return   {[type]}              [description]
   */
  onPullDownRefresh() {
    const positionList = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
    this.setData({positionList, hasReFresh: true})
    this.getPositionList().then(res => {
      this.setData({positionList, hasReFresh: false})
      wx.stopPullDownRefresh()
    }).catch(e => {
      this.setData({positionList, hasReFresh: false})
      wx.stopPullDownRefresh()
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   触底加载数据
   * @return   {[type]}   [description]
   */
  onReachBottom() {
    const positionList = this.data.positionList
    if (!positionList.isLastPage) {
      this.setData({onBottomStatus: 1})
      this.getPositionList(false)
    }
  },
  onShareAppMessage(options) {
    let that = this
　　return app.wxShare({
      options,
      title: shareChance,
      path: `${APPLICANT}index/index`
    })
  }
})
