import {
  getCompanyFinancingApi,
  getCompanyEmployeesApi,
  getCompanyIdentityInfosApi,
  perfectCompanyApi
} from '../../../../../../api/pages/company.js'

import {
  getLabelFieldApi
} from '../../../../../../api/pages/common.js'

import {realNameReg, emailReg, positionReg} from '../../../../../../utils/fieldRegular.js'

import {RECRUITER} from '../../../../../../config.js'

const app = getApp()

Page({
  data: {
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
    let storage = wx.getStorageSync('createdCompany') || {}
    getLabelFieldApi().then(res => this.setData({companyLabelField: res.data}))
    getCompanyIdentityInfosApi({hasLoading: false}).then(res => {
      let infos = res.data.companyInfo
      let formData = {
        company_name: infos.companyName,
        company_shortname: storage.company_shortname || infos.companyShortname,
        industry_id: storage.industry_id || infos.industryId,
        industry_id_name: storage.industry_id_name || infos.industry,
        financing: storage.financing || infos.financing,
        financingName: storage.financingName || infos.financingInfo,
        employees: storage.employees || infos.employees,
        employeesName: storage.employeesName || infos.employeesInfo,
        intro: storage.intro || infos.intro,
        logo: storage.logo || infos.logoInfo,
        id: infos.id
      }
      this.setData({formData}, () => this.bindBtnStatus())
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-20
   * @detail   绑定按钮的状态
   * @return   {[type]}   [description]
   */
  bindBtnStatus() {
    let formData = this.data.formData
    let canClick = this.data.canClick
    canClick = !!formData.company_shortname && formData.industry_id && formData.financing && formData.employees
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
    let formData = this.data.formData
    let params = {
      company_name: formData.company_name,
      company_shortname: formData.company_shortname,
      industry_id: formData.industry_id,
      financing: formData.financing,
      employees: formData.employees,
      id: formData.id
    }
    // 简介非必填
    if(formData.intro) params = Object.assign(params, {intro: formData.intro})
    // logo 非必填
    if(formData.logo.id) params = Object.assign(params, {logo: formData.logo.id})
    perfectCompanyApi(params).then(res => {
      let options = this.data.options
      
      if(options.action && options.action === 'edit') {
        wx.navigateTo({url: `${RECRUITER}user/company/identityMethods/identityMethods?action=edit&companyId=${res.data.companyId}`})
      } else {
        wx.navigateTo({url: `${RECRUITER}user/company/identityMethods/identityMethods?companyId=${res.data.companyId}`})
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
  },

  routeJump() {
    const storage = wx.getStorageSync('createdCompany') || {}
    wx.setStorageSync('createdCompany', Object.assign(storage, this.data.formData))
    wx.navigateTo({url: `${RECRUITER}company/introducingEdit/introducingEdit`})
  }
})