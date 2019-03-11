import { getCompanyIdentityInfosApi } from '../../../../../../api/pages/company.js'

import {realNameReg, emailReg, positionReg} from '../../../../../../utils/fieldRegular.js'

import {RECRUITER, COMMON, APPLICANT} from '../../../../../../config.js'

import {getSelectorQuery} from "../../../../../../utils/util.js"

let app = getApp()

Page({
  data: {
    step: 1,
    formData: {
      real_name: '',
      user_email: '',
      user_position: '',
    },
    canClick: false,
    options: {},
    cdnImagePath: app.globalData.cdnImagePath,
    navH: app.globalData.navHeight,
    height: 0
  },
  onLoad(options) {

    let storage = wx.getStorageSync('createdCompany')
    let params = ['real_name', 'user_email', 'user_position']
    let formData = this.data.formData
    params.map(field => formData[field] = storage[field])

    this.setData({formData, options}, () => {
      this.bindBtnStatus()
      this.getBannerHeight()
    })

    this.getCompanyIdentityInfos()
  },
  backEvent() {
    wx.removeStorageSync('createdCompany')
    wx.navigateBack({delta: 1})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-03-05
   * @detail   获取banner高度
   * @return   {[type]}   [description]
   */
  getBannerHeight() {
    getSelectorQuery('.banner').then(res => this.setData({height: res.height}))
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-12
   * @detail   获取编辑详情
   * @return   {[type]}   [description]
   */
  getCompanyIdentityInfos() {
    let storage = wx.getStorageSync('createdCompany')
    let params = ['real_name', 'user_email', 'user_position']
    let formData = this.data.formData

    // 是否已经填写过当前页面的信息
    if(storage.real_name || storage.user_email || storage.user_position) {
      params.map(field => formData[field] = storage[field])
      this.setData({formData}, () => this.bindBtnStatus())
      return
    }

    getCompanyIdentityInfosApi().then(res => {
      let infos = res.data.companyInfo
      let formData = {
        real_name: infos.realName || '',
        user_email: infos.userEmail || '',
        user_position: infos.userPosition || '',
        company_name: infos.companyName || '',
        company_shortname: infos.companyShortname || '',
        industry_id: infos.industryId || '',
        industry_id_name: infos.industry || '',
        financing: infos.financing || '',
        financingName: infos.financingInfo || '',
        employees: infos.employees,
        employeesName: infos.employeesInfo || '',
        business_license: infos.businessLicenseInfo || {},
        on_job: infos.onJobInfo || {},
        id: infos.id || '',
        logo: infos.logoInfo || {}
      }
      if(infos.intro) formData.intro = infos.intro
      if(infos.applyId) formData.applyId = infos.applyId
      this.setData({formData, canClick: true})
      wx.setStorageSync('createdCompany', Object.assign(formData, this.data.formData))
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
    let bindKeys = ['real_name', 'user_position', 'user_email']
    let canClick = bindKeys.every(field => this.data.formData[field])
    this.setData({ canClick })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-20
   * @detail   动态输入
   * @return   {[type]}     [description]
   */
  bindInput(e) {
    let field = e.currentTarget.dataset.field
    let formData = this.data.formData
    formData[field] = e.detail.value
    this.setData({formData: Object.assign(this.data.formData, formData)}, () => this.bindBtnStatus())
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-25
   * @detail   保存当前页面的数据
   * @return   {[type]}   [description]
   */
  submit() {
    let formData = this.data.formData
    let storage = wx.getStorageSync('createdCompany')
    if(!this.data.canClick) return;

    // 验证用户名
    let checkRealName = new Promise((resolve, reject) => {
      !realNameReg.test(formData.real_name) ? reject('姓名需为2-20个中文字符') : resolve()
    })

    // 验证邮箱
    let checkUserEmail = new Promise((resolve, reject) => {
      !emailReg.test(formData.user_email) ? reject('请填写有效的邮箱') : resolve()
    })

    // 验证职位
    let checkUserPosition = new Promise((resolve, reject) => {
      !positionReg.test(formData.user_position) ? reject('担任职务需为2-50个字') : resolve()
    })

    Promise.all([checkRealName, checkUserEmail, checkUserPosition]).then(res => {
      let options = this.data.options
      
      if(options.action && options.action === 'edit') {
        wx.navigateTo({url: `${RECRUITER}user/company/find/find?action=edit`})
      } else {
        wx.navigateTo({url: `${RECRUITER}user/company/find/find`})
      }
      wx.setStorageSync('createdCompany', Object.assign(storage, this.data.formData))
    })
    .catch(err => app.wxToast({title: err}))
  },
  toggle() {
    app.toggleIdentity()
  },
  changePhone() {
    app.uplogin()
  }
})