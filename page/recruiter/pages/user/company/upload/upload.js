import {
  createCompanyApi,
  editCompanyInfosApi
} from '../../../../../../api/pages/company.js'

import {RECRUITER} from '../../../../../../config.js'

const app = getApp()

Page({
  data: {
    business_license: {
      smallUrl: ''
    },
    on_job: {
      smallUrl: ''
    },
    options: {},
    canClick: false,
    formData: {
      real_name: '',
      user_email: '',
      user_position: '',
      company_name: '',
      company_shortname: '',
      industry_id: '',
      financing: '',
      employees: ''
    }
  },
  onLoad(options) {
    const storage = wx.getStorageSync('createdCompany')
    const formData = {}
    const params = ['real_name', 'user_email', 'user_position', 'company_name', 'industry_id', 'financing', 'employees']
    this.setData({options})
    formData.company_shortname = storage.companyShortName
    if(!storage) return;
    params.map(field => formData[field] = storage[field])
    this.setData({formData, business_license: storage.business_license || {}, on_job: storage.on_job || {}})
    this.bindBtnStatus()
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-21
   * @detail   图片上传
   * @return   {[type]}     [description]
   */
  upload(e) {
    const key = e.currentTarget.dataset.type
    this.setData({[key]: e.detail[0]})
    this.bindBtnStatus()
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-20
   * @detail   绑定按钮的状态
   * @return   {[type]}   [description]
   */
  bindBtnStatus() {
    const canClick = this.data.business_license.smallUrl && this.data.on_job.smallUrl ? true : false
    this.setData({ canClick })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-30
   * @detail    创建公司
   * @return   {[type]}            [description]
   */
  createCompany(formData) {
    const storage = wx.getStorageSync('createdCompany')
    const options = this.data.options
    const url = options.action && options.action === 'edit'
      ? `${RECRUITER}user/company/status/status?from=company`
      : `${RECRUITER}user/company/identity/identity?type=company&realName=${storage.real_name}`
    createCompanyApi(formData).then(res => {
      app.wxToast({title: '创建公司成功'})
      wx.reLaunch({url})
      wx.removeStorageSync('createdCompany')
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-30
   * @detail    编辑公司
   * @return   {[type]}            [description]
   */
  editCreateCompany(formData) {
    const storage = wx.getStorageSync('createdCompany')
    const params = Object.assign(formData, {id: storage.id})
    const options = this.data.options
    const url = options.action && options.action === 'edit'
      ? `${RECRUITER}user/company/status/status?from=company`
      : `${RECRUITER}user/company/identity/identity?type=company&realName=${storage.real_name}`
    editCompanyInfosApi(formData).then(res => {
      app.wxToast({title: '编辑公司成功'})
      wx.reLaunch({url})
      wx.removeStorageSync('createdCompany')
    })
  },
  submit() {
    if(!this.data.canClick) return;
    const formData = this.data.formData
    const infos = this.data.options
    const action = infos.action === 'edit' ? 'editCreateCompany' : 'createCompany'
    formData.on_job = this.data.on_job.id
    formData.business_license = this.data.business_license.id
    this[action](formData)
  }
})