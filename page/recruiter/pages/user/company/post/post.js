import {
  getCompanyFinancingApi,
  getCompanyEmployeesApi
} from '../../../../../../api/pages/company.js'

import {
  getLabelFieldApi
} from '../../../../../../api/pages/common.js'

import {realNameReg, emailReg, positionReg} from '../../../../../../utils/fieldRegular.js'

import {RECRUITER} from '../../../../../../config.js'

const app = getApp()

Page({
  data: {
    step: 3,
    formData: {
      company_name: '',
      industry_id: 0,
      industry_id_name: '请选择行业范围',
      financing: 0,
      employees: 0,
      company_shortname: '',
      logo: {},
      intro: ''
    },
    companyLabelField: [],
    canClick: false,
    options: {},
    cdnPath: app.globalData.cdnImagePath
  },
  onLoad(options) {
    this.setData({options})
  },
  onShow() {
    this.init()
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-21
   * @detail   初始化页面数据
   * @return   {[type]}   [description]
   */
  init() {
    const storage = wx.getStorageSync('createdCompany')
    const formData = this.data.formData
    getLabelFieldApi().then(res => this.setData({companyLabelField: res.data}))

    const params = [
      'industry_id',
      'financing',
      'employees',
      'employeesName',
      'financingName',
      'industry_id_name',
      'company_name',
      'company_shortname',
      'intro',
      'logo'
    ]
    // 是否已经编辑过当前页面
    if(storage.financing || storage.industry_id || storage.intro || storage.employees || storage.company_shortname ) {
      params.map(field => formData[field] = storage[field])
    } else {
      formData.company_name = storage.company_name
    }
    this.setData({ formData }, () => this.bindBtnStatus())
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-20
   * @detail   绑定按钮的状态
   * @return   {[type]}   [description]
   */
  bindBtnStatus() {
    const formData = this.data.formData
    const canClick =
      !!formData.company_shortname
      && formData.industry_id
      && formData.financing
      && formData.employees
      && formData.intro
      && formData.logo.smallUrl
      
    this.setData({ canClick })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-25
   * @detail   保存当前页面的数据
   * @return   {[type]}   [description]
   */
  submit() {
    if(!this.data.canClick) return;
    const storage = wx.getStorageSync('createdCompany')
    const options = this.data.options
    
    if(options.action && options.action === 'edit') {
      wx.navigateTo({url: `${RECRUITER}user/company/upload/upload?action=edit`})
    } else {
      wx.navigateTo({url: `${RECRUITER}user/company/upload/upload`})
    }

    wx.setStorageSync('createdCompany', Object.assign(storage, this.data.formData))
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-20
   * @detail   下拉选项绑定
   * @return   {[type]}     [description]
   */
  bindChange(e) {
    const index = parseInt(e.detail.value)
    const companyLabelField = this.data.companyLabelField
    const formData = this.data.formData
    formData.industry_id = companyLabelField[index].labelId
    formData.industry_id_name = companyLabelField[index].name
    this.setData({formData}, () => this.bindBtnStatus())
  },
  bindInput(e) {
    const formData = this.data.formData
    formData.company_shortname = e.detail.value
    this.setData({formData}, () => this.bindBtnStatus())
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-03
   * @detail   获取人员规模
   * @return   {[type]}   [description]
   */
  getStaffMembers(res) {
    const formData = this.data.formData
    formData.employees = res.detail.propsResult
    formData.employeesName = res.detail.propsDesc
    this.setData({formData}, () => this.bindBtnStatus())
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-03
   * @detail   获取融资情况
   * @return   {[type]}   [description]
   */
  getFinancing(res) {
    const formData = this.data.formData
    formData.financing = res.detail.propsResult
    formData.financingName = res.detail.propsDesc
    this.setData({formData}, () => this.bindBtnStatus())
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-16
   * @detail   上传头像
   * @return   {[type]}       [description]
   */
  upload(e) {
    const formData = this.data.formData
    formData.logo = e.detail[0]
    this.setData({formData}, () => this.bindBtnStatus())
    console.log(this.data)
  },

  routeJump() {
    const storage = wx.getStorageSync('createdCompany')
    wx.setStorageSync('createdCompany', Object.assign(storage, this.data.formData))
    wx.navigateTo({url: `${RECRUITER}company/introducingEdit/introducingEdit`})
  }
})