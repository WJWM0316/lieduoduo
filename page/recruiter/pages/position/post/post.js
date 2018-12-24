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
    province: '',
    city: '',
    district: '',
    address: '',
    doorplate: '',
    labels: '',
    labels: '',
    labels: '',
    emolument_min: '',
    emolument_max: '',
    work_experience: '',
    education: '',
    describe: '',
    canClick: false
  },
  onLoad() {
    getApp().globalData.identity = 'RECRUITER'
    this.init()
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-21
   * @detail   初始化页面数据
   * @return   {[type]}   [description]
   */
  init() {
    getPositionExperienceApi()
      .then(res => {
        this.setData({experienceLists: res.data})
      })
    getCompanyFinancingApi()
      .then(res => {
        this.setData({
          companyFinance: res.data
        })
      })
    getCompanyEmployeesApi()
      .then(res => {
        const list = res.data
        list.map(field => field.text = `${field.text}人`)
        this.setData({
          companyEmployees: list
        })
      })
    getLabelFieldApi()
      .then(res => {
        this.setData({
          companyLabelField: res.data
        })
      })
    wx.getStorage({
      key: 'createCompanyInfos',
      success: res => {
        const params = [
          'companyFinance',
          'companyEmployees',
          'companyLabelField',
          'industry_id',
          'financing',
          'employees',
          'selected_industry_id',
          'selected_financing',
          'selected_employees',
          'canClick'
        ]
        params.map(field => this.setData({ [field]: res.data[field] }))
        this.bindBtnStatus()
      }
    })
    wx.getStorage({
      key: 'createdCompanyName',
      success: res => {
        this.setData({ company_name: res.data.company_name })
        this.bindBtnStatus()
      }
    })
    wx.getStorage({
      key: 'createCompanyIntro',
      success: res => {
        const params = ['intro']
        params.map(field => this.setData({ [field]: res.data[field]}))
        this.bindBtnStatus()
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-20
   * @detail   绑定按钮的状态
   * @return   {[type]}   [description]
   */
  bindBtnStatus() {
    const canClick =
      !!this.data.intro
      && this.data.selected_employees
      && this.data.selected_financing
      && this.data.selected_industry_id
    this.setData({ canClick })
  },
  submit() {
    if(!this.data.canClick) return;
    wx.navigateTo({
      url: `${RECRUITER}user/company/upload/upload`,
      success: () => {
        this.saveFormData()
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-20
   * @detail   下拉选项绑定
   * @return   {[type]}     [description]
   */
  bindChange(e) {
    const key = e.currentTarget.dataset.key
    this.setData({
      [key]: parseInt(e.detail.value),
      [`selected_${key}`]: true
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-21
   * @detail   修改公司简称
   * @return   {[type]}   [description]
   */
  jumpModifyIntro() {
    wx.navigateTo({
      url: `${RECRUITER}user/company/abbreviation/abbreviation`,
      success: () => {
        this.saveFormData()
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-21
   * @detail   保存当前页面的编辑数据
   * @return   {[type]}   [description]
   */
  saveFormData() {
    wx.setStorage({
      key: 'createCompanyInfos',
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
    wx.navigateTo({url: `${RECRUITER}position/${route}/${route}`})
  }
})