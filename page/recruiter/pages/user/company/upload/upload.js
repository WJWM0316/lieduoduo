import {
  createCompanyApi,
  editCompanyInfosApi,
  perfectCompanyByLicenseApi,
  getCompanyIdentityInfosApi
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
      },
      id: null
    },
    options: {},
    cdnImagePath: app.globalData.cdnImagePath,
    canClick: false
  },
  onLoad(options) {
    this.getCompanyIdentityInfos()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-12
   * @detail   获取编辑详情
   * @return   {[type]}   [description]
   */
  getCompanyIdentityInfos(hasLoading = true) {
    let storage = wx.getStorageSync('createdCompany') || {}
    getCompanyIdentityInfosApi({hasLoading}).then(res => {
      let companyInfo = res.data.companyInfo
      let formData = {
        business_license: storage.business_license || companyInfo.businessLicenseInfo,
        on_job: storage.on_job || companyInfo.onJobInfo,
        company_name: storage.company_name || companyInfo.companyName,
        id: companyInfo.id
      }
      this.setData({formData, canClick: true})
      wx.setStorageSync('createdCompany', Object.assign(formData, this.data.formData))
    })
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
  submit() {
    if(!this.data.canClick) return;
    let storage = wx.getStorageSync('createdCompany')
    let options = this.data.options
    let params = {}

    params.business_license = this.data.formData.business_license.id
    params.on_job = this.data.formData.on_job.id
    params.id = this.data.formData.id
    params.company_name = this.data.formData.company_name

    perfectCompanyByLicenseApi(params).then(res => {
      app.wxToast({title: '完善公司成功'})
      wx.removeStorageSync('createdCompany')
      wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=company`})
    })
  }
})