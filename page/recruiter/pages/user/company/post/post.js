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
    company_name: '',
    companyLabelField: [],
    // 所属行业
    industry_id: 0,
    industry_id_name: '请选择行业范围',
    // 行业领域
    selected_industry_id: false,
    // 公司融资情况
    financing: 0,
    financingName: '请选择融资情况',
    selected_financing: false,
    // 人员规模
    employees: 0,
    employeesName: '请选择人员规模',
    selected_employees: false,
    // 公司简称
    companyShortName: '',
    canClick: false,
    options: {}
  },
  onLoad(options) {
    this.setData({options})
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
    getLabelFieldApi()
      .then(res => {
        this.setData({companyLabelField: res.data})
      })
    const params = [
      'companyLabelField',
      'industry_id',
      'financing',
      'employees',
      'selected_industry_id',
      'selected_financing',
      'selected_employees',
      'employeesName',
      'financingName',
      'industry_id_name',
      'company_name',
      'companyShortName',
      'canClick'
    ]
    if(!storage) return;
    params.map(field => {
      if(storage[field]) this.setData({ [field]: storage[field] })
    })
    this.bindBtnStatus()
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-20
   * @detail   绑定按钮的状态
   * @return   {[type]}   [description]
   */
  bindBtnStatus() {
    const canClick =
      !!this.data.companyShortName
      && this.data.selected_employees
      && this.data.selected_financing
      && this.data.selected_industry_id
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
    const url = options.action && options.action === 'edit'
      ? `${RECRUITER}user/company/upload/upload?action=edit&type=create`
      : `${RECRUITER}user/company/upload/upload`
    wx.setStorageSync('createdCompany', Object.assign(storage, this.data))
    wx.navigateTo({url})
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
    this.setData({industry_id: companyLabelField[index].labelId, selected_industry_id: true, industry_id_name: companyLabelField[index].name})
    this.bindBtnStatus()
  },
  bindInput(e) {
    this.setData({companyShortName: e.detail.value})
    this.bindBtnStatus()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-03
   * @detail   获取人员规模
   * @return   {[type]}   [description]
   */
  getStaffMembers(res) {
    this.setData({employees: res.detail.propsResult, employeesName: res.detail.propsDesc, selected_employees: true})
    this.bindBtnStatus()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-03
   * @detail   获取融资情况
   * @return   {[type]}   [description]
   */
  getFinancing(res) {
    this.setData({financing: res.detail.propsResult, financingName: res.detail.propsDesc, selected_financing: true})
    this.bindBtnStatus()
  }
})