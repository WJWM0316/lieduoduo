import {
  getCompanyInfosApi,
  getRecruitersListApi
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

let app = getApp()

Page({

  data: {
    tab: 'about',
    indicatorDots: false,
    autoplay: true,
    interval: 1000,
    duration: 1000,
    query: {},
    companyInfos: {},
    recruitersList: [],
    companyList: [],
    jobList: [],
    longitude: 0,
    latitude: 0,
    cdnImagePath: app.globalData.cdnImagePath,
    positionTypeList: [],
    labelId: null
  },
  onLoad(options) {
    this.setData({query: options})
    this.init().then(() => this.getLabelPosition())
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
   * @DateTime 2019-01-23
   * @detail   选择技能
   * @return   {[type]}     [description]
   */
  selectSkill(e) {
    const params = e.currentTarget.dataset
    const positionTypeList = this.data.positionTypeList
    let labelId = null
    positionTypeList.map((field, index) => {
      if(index === params.index) {
        field.active = true
        labelId = field.labelId
      } else {
        field.active = false
      }
    })
    this.setData({positionTypeList, labelId}, () => this.getPositionList())
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-10
   * @detail   获取职位详情
   * @return   {[type]}   [description]
   */
  getPositionList() {
    const options = this.data.query
    const params = {company_id: options.companyId}
    getPositionListApi(params).then(res => {
      this.setData({jobList: res.data})
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-23
   * @detail   获取技能标签
   * @return   {[type]}   [description]
   */
  getLabelPosition() {
    getLabelPositionApi()
      .then(res => {
        const positionTypeList = res.data
        positionTypeList.map(field => field.active = false)
        positionTypeList.unshift({
          labelId: 'all',
          name: '全部',
          type: 'self_label_position',
          active: true
        })
        this.setData({positionTypeList}, () => this.getPositionList())
      })
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
  getCompanyDetail() {
    return new Promise((resolve, reject) => {
      getCompanyInfosApi({id: this.data.query.companyId})
        .then(res => {
          const companyInfos = res.data
          const longitude = companyInfos.address.length ? companyInfos.address[0].lng : 0
          const latitude = companyInfos.address.length ? companyInfos.address[0].lat : 0
          this.setData({companyInfos, longitude, latitude }, () => resolve(res))
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
    getRecruitersListApi({id: this.data.query.companyId, page: 1, count: 3})
      .then(res => {
        this.setData({recruitersList: res.data})
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
      name: '公司地址',
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
    const albumInfo = this.data.companyInfos.albumInfo.map(field => field.url)
    const params = e.currentTarget.dataset
    wx.previewImage({
      current: params.index,
      urls: albumInfo
    })
  }
})