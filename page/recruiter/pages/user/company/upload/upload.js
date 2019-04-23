import {
  createCompanyApi,
  editCompanyInfosApi,
  perfectCompanyByLicenseApi,
  getCompanyIdentityInfosApi,
  perfectCompanyApi
} from '../../../../../../api/pages/company.js'

import {RECRUITER} from '../../../../../../config.js'

const app = getApp()

Page({
  data: {
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
    let storage = wx.getStorageSync('createdCompany') || {}
    let formData = {
      business_license: storage.business_license,
      on_job: storage.on_job
    }
    this.setData({formData}, () => this.bindBtnStatus())
  },
  backEvent() {
    let storage = wx.getStorageSync('createdCompany') || {}
    let formData = this.data.formData
    storage.business_license = formData.business_license
    storage.on_job = formData.on_job
    wx.setStorageSync('createdCompany', storage)
    wx.navigateBack({delta: 1})
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
    const canClick = formData.business_license.smallUrl && formData.on_job.smallUrl ? true : false
    this.setData({canClick})
  },
  submit() {
    if(!this.data.canClick) return;
    let storage = wx.getStorageSync('createdCompany') || {}
    let params = {
      company_name: storage.company_name,
      industry_id: storage.industry_id,
      financing: storage.financing,
      employees: storage.employees,
      company_shortname: storage.company_shortname,
      logo: storage.logo.id,
      intro: storage.intro,
      business_license: this.data.formData.business_license.id,
      on_job: this.data.formData.on_job.id,
      id: storage.id
    }
    perfectCompanyApi(params).then(res => {
      wx.removeStorageSync('createdCompany')
      wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=company`})
    })
    .catch(msg => {
      if(msg.code === 808) {
        app.wxToast({
          title: msg.msg,
          callback() {
            wx.removeStorageSync('createdCompany')
            wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=company`})
          }
        })
      }
    })
  }
})