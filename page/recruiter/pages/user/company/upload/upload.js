import { createCompanyApi } from '../../../../../../api/pages/company.js'

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
    formData.company_shortname = storage.companyShortName
    if(!storage) return;
    params.map(field => formData[field] = storage[field])
    this.setData({formData})
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-21
   * @detail   图片上传
   * @return   {[type]}     [description]
   */
  upload(e) {
    const key = e.currentTarget.dataset.type
    this.setData({ [key]: e.detail[0] })
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
  submit() {
    if(!this.data.canClick) return;
    const formData = this.data.formData
    formData.on_job = this.data.on_job.id
    formData.business_license = this.data.business_license.id
    createCompanyApi(formData)
      .then(res => {
        app.wxToast({title: res.msg})
        wx.navigateTo({url: `${RECRUITER}user/company/identity/identity`})
        wx.removeStorageSync('createdCompany')
      })
      .catch(err => {
        app.wxToast({title: err.msg})
      })
  }
})