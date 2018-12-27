import {
  getCompanyFinancingApi,
  getCompanyEmployeesApi
} from '../../../../../api/pages/company.js'

import {
  getPositionExperienceApi
} from '../../../../../api/pages/position.js'

import {
  getLabelFieldApi
} from '../../../../../api/pages/common.js'

import {realNameReg, emailReg, positionReg} from '../../../../../utils/fieldRegular.js'

import {RECRUITER} from '../../../../../config.js'

const app = getApp()

Page({
  data: {
    position_name: '',
    company_id: '',
    type: '',
    typeName: '',
    province: '',
    city: '',
    district: '',
    address: '',
    doorplate: '',
    labels: [],
    emolument_min: '',
    emolument_max: '',
    emolument_range: '',
    work_experience: '',
    education: '',
    describe: '',
    skills: [],
    canClick: false
  },
  onLoad(options) {
    getApp().globalData.identity = 'RECRUITER'
    this.init(options)
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-21
   * @detail   初始化页面数据
   * @return   {[type]}   [description]
   */
  init(options) {
    wx.getStorage({
      key: 'createPosition',
      success: res => {

        const params = Object.keys(res.data).filter(filed => filed !== '__webviewId__' || filed !== 'describe' || field !== 'labels')
        const labels = []
        params.map(field => this.setData({[field]: res.data[field]}))

        // 已经编辑职位名
        if(options.position_name) {
          this.setData({position_name: options.position_name})
        }

        // 已经编辑职位名
        if(options.type) {
          this.setData({type: options.type, typeName: options.typeName})
        }

        res.data.skills.map(field => labels.push({id: field.labelId}))
        this.setData({labels})
      }
    })

    // 描述
    wx.getStorage({
      key: 'positionDescribe',
      success: res => this.setData({describe: res.data})
    })
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
   * @DateTime 2018-12-21
   * @detail   保存当前页面的编辑数据
   * @return   {[type]}   [description]
   */
  saveFormData() {
    wx.setStorage({
      key: 'createPosition',
      data: this.data
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
    if(route === 'skills' && !this.data.type) {
      app.wxToast({title: '请先选择职业类型别'})
    } else {
      wx.navigateTo({url: `${RECRUITER}position/${route}/${route}`})
      this.saveFormData()
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
      emolument_range: `${e.detail.propsResult[0]}~${e.detail.propsResult[0]}`
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-26
   * @detail   获取工作经验
   * @return   {[type]}     [description]
   */
  getExperience(e) {
    this.setData({work_experience: e.detail.propsResult})
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-26
   * @detail   获取教育经历
   * @return   {[type]}     [description]
   */
  getEducation(e) {
    this.setData({work_experience: e.detail.propsResult})
  },
  submit() {
    console.log(this.data)
  }
})