import {
  createCompanyApi,
  editCompanyInfosApi
} from '../../../../../../api/pages/company.js'

import {RECRUITER} from '../../../../../../config.js'

const app = getApp()

Page({
  data: {
    step: 4,
    formData: {
      business_license: {
        smallUrl: ''
      },
      on_job: {
        smallUrl: ''
      }
    },
    options: {},
    cdnImagePath: app.globalData.cdnImagePath,
    canClick: false
  },
  onLoad(options) {
    const storage = wx.getStorageSync('createdCompany')
    const formData = {}
    if((storage.business_license && storage.business_license.smallUrl) || (storage.on_job && storage.on_job.smallUrl)) {
      formData.business_license = storage.business_license
      formData.on_job = storage.on_job
    }
    this.setData({options, formData}, () => this.bindBtnStatus())
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-21
   * @detail   图片上传
   * @return   {[type]}     [description]
   */
  upload(e) {
    const key = e.currentTarget.dataset.type
    const formData = this.data.formData
    formData[key] = e.detail[0]
    this.setData({formData}, () => this.bindBtnStatus())
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-20
   * @detail   绑定按钮的状态
   * @return   {[type]}   [description]
   */
  bindBtnStatus() {
    const formData = this.data.formData
    const canClick = (formData.business_license && formData.business_license.smallUrl) && (formData.on_job && formData.on_job.smallUrl) ? true : false
    this.setData({canClick})
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

    createCompanyApi(formData).then(res => {
      app.wxToast({title: '创建公司成功'})

      if(options.action && options.action === 'edit') {
        wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=company`})
      } else {
        wx.reLaunch({url: `${RECRUITER}user/company/identity/identity?realName=${storage.real_name}&from=company`})
      }

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
    const options = this.data.options

    editCompanyInfosApi(formData).then(res => {
      if(options.action && options.action === 'edit') {
        app.wxToast({
          title: '编辑公司成功',
          callback() {
            wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=company`})
            wx.removeStorageSync('createdCompany')
          }
        })
      } else {
        app.wxToast({
          title: '编辑公司成功',
          callback() {
            wx.reLaunch({url: `${RECRUITER}user/company/identity/identity?realName=${storage.real_name}&from=company`})
            wx.removeStorageSync('createdCompany')
          }
        })
      }
    })
  },
  submit() {
    if(!this.data.canClick) return;
    const storage = wx.getStorageSync('createdCompany')
    const formData = {}
    const options = this.data.options

    formData.real_name = storage.real_name
    formData.user_email = storage.user_email
    formData.user_position = storage.user_position
    formData.company_name = storage.company_name
    formData.industry_id = storage.industry_id
    formData.financing = storage.financing
    formData.employees = storage.employees
    formData.business_license = storage.business_license
    formData.on_job = storage.on_job
    formData.logo = storage.logo.id
    formData.intro = storage.intro
    formData.company_shortname = storage.company_shortname
    formData.on_job = this.data.formData.on_job.id
    formData.business_license = this.data.formData.business_license.id

    if(storage.id) formData.id = storage.id

    if(options.action && options.action === 'edit') {
      this.editCreateCompany(formData)
    } else {
      this.createCompany(formData)
    }
  }
})