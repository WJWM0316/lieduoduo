import {
  getCompanyInfosApi,
  getRecruitersListApi,
  getOnlinePositionTypeApi
} from '../../../../api/pages/company.js'

import {
  getLabelPositionApi,
  getLabelLIstsApi
} from '../../../../api/pages/label.js'

import {
  RECRUITERHOST,
  COMMON,
  RECRUITER
} from '../../../../config.js'

import {
  getPositionListApi
} from "../../../../api/pages/position.js"

import {getSelectorQuery} from "../../../../utils/util.js"

import { agreedTxtC, agreedTxtB } from '../../../../utils/randomCopy.js'

let app = getApp()
let positionCard = ''
Page({
  data: {
    navH: app.globalData.navHeight,
    tab: 'about',
    indicatorDots: false,
    autoplay: false,
    interval: 1000,
    duration: 1000,
    query: {},
    companyInfos: {},
    recruitersList: [],
    cdnImagePath: app.globalData.cdnImagePath,
    positionTypeList: [],
    onlinePositionTypeList: [],
    typeId: null,
    domHeight: 0,
    isFixed: false,
    requireOAuth: false,
    map: {
      longitude: 0,
      latitude: 0,
      markers: []
    },
    positionList: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    },
    pageCount: 20,
    hasReFresh: false,
    onBottomStatus: 0,
    swiperIndex: 0
  },
  onLoad(options) {
    if (options.scene) options = app.getSceneParams(options.scene)
    this.setData({query: options})
    positionCard = ''
  },
  onShow() {
    if (app.loginInit) {
      this.init().then(() => this.getOnlinePositionType())
      this.getDomNodePosition()
    } else {
      app.loginInit = () => {
        this.init().then(() => this.getOnlinePositionType())
        this.getDomNodePosition()
      }
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-02-19
   * @detail   获取定位结点的位置
   * @return   {[type]}   [description]
   */
  getDomNodePosition() {
    getSelectorQuery('.banner').then(res => {
      this.setData({domHeight: res.height})
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-23
   * @detail   获取页面初始化数据
   * @return   {[type]}   [description]
   */
  init() {
    return Promise.all([this.getCompanyDetail(), this.getRecruitersList()])
  },

  /**
   * @Author   小书包
   * @DateTime 2019-01-25
   * @detail   重新加载数据
   * @return   {[type]}   [description]
   */
  onPullDownRefresh() {
    const positionList = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
    this.setData({positionList, hasReFresh: true, isFixed: false})
    this.getPositionList(false).then(res => {
      const positionList = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
      const onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
      positionList.list = res.data
      positionList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
      positionList.pageNum = 2
      positionList.isRequire = true
      this.setData({positionList, onBottomStatus, hasReFresh: false}, () => wx.stopPullDownRefresh())
    }).catch(e => {
      wx.stopPullDownRefresh()
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-10
   * @detail   获取职位详情
   * @return   {[type]}   [description]
   */
  getPositionList(hasLoading = true) {
    return new Promise((resolve, reject) => {
      const options = this.data.query
      let params = {company_id: options.companyId, count: this.data.pageCount, page: this.data.positionList.pageNum}
      if(typeof this.data.typeId === 'number') {
        params = Object.assign(params, {type: this.data.typeId})
      }
      getPositionListApi(params, hasLoading).then(res => {

        const positionList = this.data.positionList
        const onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        if(params.page !== 1) {
          positionList.list = positionList.list.concat(res.data)
        } else {
          positionList.list = res.data
        }
        positionList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        positionList.pageNum = positionList.pageNum + 1
        positionList.isRequire = true
        this.setData({positionList, onBottomStatus}, () => resolve(res))
      })
    })
  },

  //获取公司职位类型列表
  getOnlinePositionType() {
    let data = {
      companyId: this.data.query.companyId
    }
    getOnlinePositionTypeApi(data).then(res=>{
      const positionTypeList = res.data
      positionTypeList.map(field => field.active = false)
      positionTypeList.unshift({
        id: 'all',
        name: '全部',
        active: true
      })
      this.setData({positionTypeList}, () => this.getPositionList())
    })
  },

  // 职位分类选择
  setType(e) {
    let id = e.currentTarget.dataset.id
    let positionTypeList = this.data.positionTypeList
    let typeId = null
    if(this.data.typeId === id) return
    let positionList = this.data.positionList
    positionList.pageNum = 1
    positionTypeList.map(item => {
      item.active = false
      if (item.id === id) {
        typeId = item.id
        item.active = true
      }
    })
    this.setData({positionTypeList, typeId, positionList}, () => this.getPositionList())
  },

  /**
   * @Author   小书包
   * @DateTime 2019-01-23
   * @detail   跳转招聘官主页
   * @return   {[type]}     [description]
   */
  bindMain(e) {
    wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${e.currentTarget.dataset.uid}`})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-02
   * @detail   获取公司详情
   * @return   {[type]}   [description]
   */
  getCompanyDetail(hasLoading = true, isReload = false) {
    return new Promise((resolve, reject) => {
      getCompanyInfosApi({id: this.data.query.companyId, hasLoading, isReload, ...app.getSource()}).then(res => {
        let requireOAuth = res.meta && res.meta.requireOAuth ? res.meta.requireOAuth : false
        const companyInfos = res.data
        const longitude = companyInfos.address.length ? companyInfos.address[0].lng : 0
        const latitude = companyInfos.address.length ? companyInfos.address[0].lat : 0
        const address = companyInfos.address.length ? companyInfos.address[0].address : ''
        const doorplate = companyInfos.address.length ? companyInfos.address[0].doorplate : ''
        const map = this.data.map
        map.longitude = longitude
        map.latitude = latitude
        map.address = address
        map.doorplate = doorplate
        map.enableScroll = false
        map.markers.push({
          id: 1,
          longitude,
          latitude,
          label: {
            content: companyInfos.companyShortname,
            fontSize:'18rpx',
            color:'#282828',
            anchorX: '30rpx',
            anchorY: '-60rpx'
          }
        })
        this.setData({companyInfos, map, requireOAuth}, () => resolve(res))
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-04
   * @detail   获取招聘团队
   * @return   {[type]}   [description]
   */
  getRecruitersList() {
    getRecruitersListApi({id: this.data.query.companyId, page: 1, count: 4}).then(res => {
      const wordIndex = Math.floor(Math.random()*8)
      const recruitersList = res.data
      recruitersList.map(field => field.randomTxt = agreedTxtB())
      this.setData({recruitersList, wordIndex})
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-04
   * @detail   选项卡切换
   * @return   {[type]}     [description]
   */
  onTabClick(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({tab})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-04
   * @detail   轮播图设置
   * @return   {[type]}     [description]
   */
  swiperChange(e) {
    this.setData({swiperIndex: e.detail.current})
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-29
   * @detail   复制
   * @return   {[type]}   [description]
   */
  copyLink() {
    wx.setClipboardData({data: this.data.companyInfos.website })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-29
   * @detail   离开当前页面
   * @return   {[type]}   [description]
   */
  routeJump(e) {
    const route = e.currentTarget.dataset.route
    switch(route) {
      case 'map':
        wx.navigateTo({url: `${COMMON}map/map`})
        break
      case 'recruitersList':
        wx.navigateTo({url: `${RECRUITER}user/company/recruiterList/recruiterList?companyId=${this.data.companyInfos.id}`})
        break
      default:
        break
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-19
   * @detail   查看地址
   * @return   {[type]}     [description]
   */
  viewMap(e) {
    const params = e.currentTarget.dataset
    wx.openLocation({
      latitude: Number(params.latitude),
      longitude: Number(params.longitude),
      scale: 14,
      address: `${params.address} ${params.doorplate}`,
      fail: res => {
        app.wxToast({title: '获取位置失败'})
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-22
   * @detail   查看大图
   * @return   {[type]}   [description]
   */
  previewImage(e) {
    let albumInfo = this.data.companyInfos.albumInfo.map(field => field.url)
    let current = albumInfo.find((value, now, arr) => now === this.data.swiperIndex)
    wx.previewImage({current, urls: albumInfo})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-23
   * @detail   就算页面的滚动
   * @return   {[type]}     [description]
   */
  onPageScroll(e) {
    let isFixed = e.scrollTop > this.data.domHeight
    this.setData({isFixed})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   触底加载数据
   * @return   {[type]}   [description]
   */
  onReachBottom() {
    const positionList = this.data.positionList
    if (!positionList.isLastPage && this.data.tab !== 'about') {
      this.getPositionList(false).then(() => this.setData({onBottomStatus: 1}))
    }
  },
  getCreatedImg(e) {
    positionCard = e.detail
  },
  onShareAppMessage(options) {
    let that = this
    let imageUrl = `${that.data.cdnImagePath}shareC.png`
    app.shareStatistics({
      id: that.data.query.companyId,
      type: 'company',
      sCode: that.data.companyInfos.sCode,
      channel: 'card'
    })
    if(positionCard){
      imageUrl = positionCard
    }
    console.log('companyInfos=====>',this.data.companyInfos)
　　return app.wxShare({
      options,
      title: `${that.data.companyInfos.companyShortname}正在招聘，马上约面，极速入职！我在猎多多等你！`,
      path: `${COMMON}homepage/homepage?companyId=${this.data.query.companyId}&sCode=${this.data.companyInfos.sCode}&sourceType=shc`,
      imageUrl: imageUrl
    })
  }
})