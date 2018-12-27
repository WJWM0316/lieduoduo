import {
  createPositionApi,
  getPositionApi
} from '../../../../../api/pages/position.js'

import { getRecruiterMyInfoApi } from '../../../../../api/pages/recruiter.js'

import {realNameReg, emailReg, positionReg} from '../../../../../utils/fieldRegular.js'

import {RECRUITER} from '../../../../../config.js'

const app = getApp()

Page({
  data: {
    choseType: wx.getStorageSync('choseType') || null,
    userInfo: null,
    needLogin: false,
    position_name: '',
    company_id: '',
    lng: '',
    lat: '',
    type: '',
    typeName: '',
    area_id: '440106',
    address: '广东省广州市天河区天河北路613号',
    doorplate: '',
    labels: [],
    emolument_min: '',
    emolument_max: '',
    emolument_range: '',
    work_experience: '',
    work_experience_name: '',
    education: '',
    educationName: '',
    describe: '',
    skills: [],
    canClick: false
  },
  onLoad() {
    getApp().globalData.identity = 'RECRUITER'
    getApp().checkLogin().then(res => {
      this.setData({userInfo: res})
    })
    this.init()
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-21
   * @detail   初始化页面数据
   * @return   {[type]}   [description]
   */
  init() {
    const storage = wx.getStorageSync('createPosition')
    if(storage) {
      Object.keys(storage).map(field => this.setData({[field]: storage[field]}))
      const labels = storage.skills.map(field => field.labelId)
      this.setData({ labels })
    }
    // getRecruiterMyInfoApi()
    //   .then(res => {
    //     this.setData({company_id: res.data.companyId})
    //   })
    // getPositionApi({id: 11})
    //   .then(res => {
    //     console.log(res.data)
    //   })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-20
   * @detail   绑定按钮的状态
   * @return   {[type]}   [description]
   */
  bindBtnStatus() {
    console.log(1)
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-24
   * @detail   离开当前页面
   * @return   {[type]}     [description]
   */
  routeJump(e) {
    const route = e.currentTarget.dataset.route
    if(route === 'skills' && !this.data.type) {
      app.wxToast({title: '请先选择职业类型别'})
    } else {
      wx.navigateTo({url: `${RECRUITER}position/${route}/${route}`})
      wx.setStorageSync('createPosition', this.data)
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-26
   * @detail   获取薪资范围
   * @return   {[type]}     [description]
   */
  getSalary(e) {
    this.setData({
      emolument_min: parseInt(e.detail.propsResult[0]),
      emolument_max: parseInt(e.detail.propsResult[1]),
      emolument_range: `${e.detail.propsResult[0]}~${e.detail.propsResult[1]}`
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-26
   * @detail   获取工作经验
   * @return   {[type]}     [description]
   */
  getExperience(e) {
    this.setData({work_experience: e.detail.propsResult, work_experience_name: e.detail.propsDesc})
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-26
   * @detail   获取教育经历
   * @return   {[type]}     [description]
   */
  getEducation(e) {
    this.setData({education: e.detail.propsResult, educationName: e.detail.propsDesc})
  },
  submit() {
    getApp().globalData.hasLogin = true
    const formData = {}
    const params = [
      'position_name',
      'company_id',
      'type',
      'address',
      'area_id',
      'address',
      'doorplate',
      'labels',
      'emolument_min',
      'emolument_max',
      'work_experience',
      'education',
      'describe'
    ]
    params.map(field => formData[field] = this.data[field])
    createPositionApi(formData)
      .then(res => {
        wx.removeStorageSync('createPosition')
        wx.removeStorageSync('mapInfos')
        wx.navigateTo({url: `${RECRUITER}position/index/index`})
      })
      .catch(err => app.wxToast({title: err.msg}))
  }
})