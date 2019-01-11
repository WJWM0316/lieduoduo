
import {
  getCompanyInfosApi,
  getRecruitersListApi
} from '../../../../api/pages/company.js'

import {RECRUITERHOST, COMMON} from '../../../../config.js'
import {getPositionListApi} from "../../../../api/pages/position.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: 'about',
    indicatorDots: false,
    autoplay: true,
    interval: 1000,
    duration: 1000,
    link: 'https://www.xiaodengta.com',
    query: {},
    companyInfos: {},
    recruitersList: [],
    companyList: [],
    jobList: []
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
        this.setData({companyInfos: res.data})
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
    wx.setClipboardData({
      data: this.data.link,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  regionchange(e) {
    // console.log(e.type)
  },
  markertap(e) {
    // console.log(e.markerId)
  },
  controltap(e) {
    // console.log(e.controlId)
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-29
   * @detail   离开当前页面
   * @return   {[type]}   [description]
   */
  routeJump(e) {
    const route = e.currentTarget.dataset.route
    console.log(route)
    switch(route) {
      case 'map':
        wx.navigateTo({url: `${COMMON}map/map`})
        break
      default:
        break
    }
  }
})