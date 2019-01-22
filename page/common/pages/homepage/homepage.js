
import {
  getCompanyInfosApi,
  getRecruitersListApi
} from '../../../../api/pages/company.js'

import {RECRUITERHOST, COMMON, RECRUITER} from '../../../../config.js'
import {getPositionListApi} from "../../../../api/pages/position.js"
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: 'recruitment',
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
    cdnImagePath: app.globalData.cdnImagePath
  },
  onLoad(options) {
    this.setData({query: options})
    this.getCompanyDetail()
    this.getRecruitersList()
    this.getPositionList(options)
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-10
   * @detail   获取职位详情
   * @return   {[type]}   [description]
   */
  getPositionList(options) {
    getPositionListApi({company_id: options.companyId}).then(res => {
      this.setData({jobList: res.data})
    })
  },
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
    getCompanyInfosApi({id: this.data.query.companyId})
      .then(res => {
        const companyInfos = res.data
        this.setData({companyInfos, longitude: companyInfos.address[0].lng, latitude: companyInfos.address[0].lat })
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
  }
})