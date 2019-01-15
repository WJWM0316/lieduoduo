import {
  createPositionApi,
  editPositionApi,
  getPositionApi
} from '../../../../../api/pages/position.js'

import {realNameReg, emailReg, positionReg} from '../../../../../utils/fieldRegular.js'

import {RECRUITER, COMMON} from '../../../../../config.js'

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
    area_id: '',
    address: '',
    doorplate: '',
    address_id: '',
    type: '',
    typeName: '',
    labels: [],
    emolument_min: '',
    emolument_max: '',
    emolument_range: '请选择薪资范围',
    work_experience: '',
    work_experience_name: '请选择经验要求',
    education: '',
    educationName: '请选择学历',
    describe: '',
    skills: [],
    query: {},
    pageTitle: '',
    canClick: true
  },
  onLoad(options) {
    this.setData({pageTitle: options.positionId ? '编辑职位' : '创建职位', query: options})
  },
  onShow() {
    const options = this.data.query
    this.init(options)
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-21
   * @detail   初始化页面数据
   * @return   {[type]}   [description]
   */
  init(options) {
    const storage = wx.getStorageSync('createPosition')

    const labels = []

    this.setData({query: options, company_id: app.globalData.recruiterDetails.companyInfo.id})

    if(storage) {
      Object.keys(storage).map(field => this.setData({[field]: storage[field]}))
      return;
    }

    // 以下是编辑页面数据
    if(options.positionId) this.getUpdateInfos(options)
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-28
   * @detail   获取编辑页面的信息
   * @param    {[type]}   options [description]
   * @return   {[type]}           [description]
   */
  getUpdateInfos(options) {
    const storage = wx.getStorageSync('createPosition')
    if(storage) {
      Object.keys(storage).map(field => this.setData({[field]: storage[field]}))
      return;
    }
    getPositionApi({id: options.positionId})
      .then(res => {
        const formData = {}
        const infos = res.data
        formData.position_name = infos.positionName
        formData.area_id = infos.areaId
        formData.work_experience_name = infos.workExperience
        formData.type = infos.type
        formData.typeName = infos.typeName
        formData.emolument_min = infos.emolumentMin
        formData.emolument_max = infos.emolumentMax
        formData.emolument_range = `${formData.emolument_min}k~${formData.emolument_max}k`
        formData.doorplate = infos.doorplate
        formData.company_id = infos.companyId
        formData.address = infos.address
        formData.skills = infos.skillsLabel
        formData.describe = infos.describe
        formData.education = infos.education
        formData.educationName = infos.educationName
        formData.work_experience = infos.workExperience
        formData.work_experience_name = infos.workExperienceName
        formData.lng = infos.lng
        formData.lat = infos.lat
        Object.keys(formData).map(field => this.setData({[field]: formData[field]}))
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-24
   * @detail   离开当前页面
   * @return   {[type]}     [description]
   */
  routeJump(e) {
    const route = e.currentTarget.dataset.route
    const url = this.data.query.positionId ? `${RECRUITER}position/${route}/${route}?positionId=${this.data.query.positionId}` : `${RECRUITER}position/${route}/${route}`
    if(route === 'skills' && !this.data.type) {
      app.wxToast({title: '请先选择职业类型别'})
    } else {
      wx.navigateTo({ url })
      wx.setStorageSync('createPosition', this.data)
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-24
   * @detail   离开当前页面
   * @return   {[type]}     [description]
   */
  getCategory() {
    const url = this.data.query.positionId ? `${COMMON}category/category?positionId=${this.data.query.positionId}` : `${COMMON}category/category`
    wx.navigateTo({ url })
    wx.setStorageSync('createPosition', this.data)
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
    const formData = {}
    const labels = []
    const action = this.data.query.positionId ? 'editPositionApi' : 'createPositionApi'
    const params = [
      'position_name',
      'company_id',
      'type',
      'address',
      'area_id',
      'address',
      'labels',
      'doorplate',
      'emolument_min',
      'emolument_max',
      'work_experience',
      'education',
      'describe',
      'lng',
      'lat',
      'address_id',
    ]
    params.map(field => formData[field] = this.data[field])
    this.data.skills.map((field, index) => labels.push({id: field.labelId, is_diy: 0}))
    formData.labels = JSON.stringify(labels)
    if(this.data.query.positionId) formData.id = this.data.query.positionId
    if(this.data.address_id) {
      delete formData.lng
      delete formData.lng
      delete formData.lat
      delete formData.area_id
      delete formData.address
      delete formData.doorplate
    } else {
      delete formData.address_id
    }
    this[action](formData)
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-28
   * @detail   创建职位
   * @return   {[type]}   [description]
   */
  createPositionApi(formData) {
    if(!this.data.canClick) return;
    createPositionApi(formData)
      .then(res => {
        wx.removeStorageSync('createPosition')
        wx.reLaunch({url: `${RECRUITER}position/index/index`})
        app.wxToast({title: '创建成功'})
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-28
   * @detail   编辑职位
   * @return   {[type]}   [description]
   */
  editPositionApi(formData) {
    editPositionApi(formData)
      .then(res => {
        wx.removeStorageSync('createPosition')
        wx.reLaunch({url: `${RECRUITER}position/index/index`})
        app.wxToast({title: '编辑成功'})
      })
  }
})