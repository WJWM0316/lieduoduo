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
      employees: '',
      business_license: '',
      on_job: '',
      intro: '这个是不必要的啊'
    }
  },
  onLoad(options) {
    getApp().globalData.identity = 'RECRUITER'
    this.init(options)
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
  /**
   * @Author   小书包
   * @DateTime 2018-12-21
   * @detail   获取创建公司的所有参数
   * @return   {[type]}   [description]
   */
  init(options) {
    // 第一步
    wx.getStorage({
      key: 'createdCompanyBase',
      success: res => {
        const params = ['real_name', 'user_email', 'user_position']
        const formData = this.data.formData
        params.map(field => formData[field] = res.data[field])
        this.setData({ formData })
      }
    })

    // 第二步
    if(options.company_name) {
      const params = ['company_name']
      const formData = this.data.formData
      formData.company_name = options.company_name
      this.setData({ formData })
      this.bindBtnStatus()
    }

    // 第三步
    wx.getStorage({
      key: 'createCompanyInfos',
      success: res => {
        const params = [
          'industry_id',
          'financing',
          'employees'
        ]
        const formData = this.data.formData
        params.map(field => formData[field] = res.data[field])
        this.setData({ formData })
      }
    })
    if(options.companyShortName) {
      const params = ['company_shortname']
      const formData = this.data.formData
      formData.company_shortname = options.companyShortName
      this.setData({ formData })
      this.bindBtnStatus()
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-25
   * @detail   清除缓存
   * @return   {[type]}   [description]
   */
  clearCache() {
    wx.removeStorage({key: 'createCompanyInfos'})
    wx.removeStorage({key: 'createdCompanyBase'})
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
        this.clearCache()
      })
      .catch(err => {
        app.wxToast({title: err.msg})
      })
  }
})