import {
  getCompanyFinancingApi,
  getCompanyEmployeesApi,
  getLabelFieldApi
} from '../../../../../../api/pages/user.js'

import {realNameReg, emailReg, positionReg} from '../../../../../../utils/fieldRegular.js'

import {RECRUITER} from '../../../../../../config.js'

const app = getApp()

Page({
  data: {
    real_name: '',
    user_email: '',
    user_position: '',
    company_id: 1,
    companyFinance: [],
    companyEmployees: [],
    companyLabelField: [],
    // 所属行业
    industry_id: 0,
    // 公司融资情况
    financing: 0,
    // 员工人数范围
    employees: 0,
    selected_industry_id: false,
    selected_financing: false,
    selected_employees: false,
    intro: '',
    canClick: false
  },
  onLoad() {
    getApp().globalData.identity = 'RECRUITER'
    wx.getStorage({
      key: 'createCompanyInfos',
      success: res => {
        const params = Object.keys(res.data).slice(0, Object.keys(res.data).length - 1)
        const intro = wx.getStorageSync('intro')
        params.map(field => {
          this.setData({
            [field]: res.data[field]
          })
        })
        if(intro) {
          this.setData({ intro })
        }
      },
      fail: err => {
        this.init()
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-21
   * @detail   初始化页面数据
   * @return   {[type]}   [description]
   */
  init() {
    const intro = wx.getStorageSync('intro')
    if(intro) {
      this.setData({ intro })
    }
    getCompanyFinancingApi()
      .then(res => {
        this.setData({
          companyFinance: res.data
        })
      })
    getCompanyEmployeesApi()
      .then(res => {
        const list = res.data
        list.map(field => field.text = `${field.text}人`)
        this.setData({
          companyEmployees: list
        })
      })
    getLabelFieldApi()
      .then(res => {
        this.setData({
          companyLabelField: res.data
        })
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-20
   * @detail   绑定按钮的状态
   * @return   {[type]}   [description]
   */
  bindBtnStatus() {
    const bindKeys = ['real_name', 'user_position', 'user_email']
    const canClick = bindKeys.every(field => this.data[field])
    this.setData({
      canClick
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-20
   * @detail   动态输入
   * @return   {[type]}     [description]
   */
  bindInput(e) {
    const field = e.currentTarget.dataset.field
    this.setData({[
      field]: e.detail.value 
    })
    this.bindBtnStatus()
  },
  submit() {
    if(!this.data.canClick) return;
    // 验证用户名
    let checkRealName = new Promise((resolve, reject) => {
      !realNameReg.test(this.data.real_name) ? reject('请填写有效的姓名') : resolve()
    })

    // 验证邮箱
    let checkUserEmail = new Promise((resolve, reject) => {
      !emailReg.test(this.data.user_email) ? reject('请填写有效的邮箱') : resolve()
    })

    // 验证公司地址
    let checkUserPosition = new Promise((resolve, reject) => {
      !positionReg.test(this.data.user_position) ? reject('请填写有效的公司地址') : resolve()
    })

    Promise.all([checkRealName, checkUserEmail, checkUserPosition])
           .then(res => {
              applyCompanyApi(this.form)
           })
           .catch(err => {
              wx.showToast({title: err, icon: 'none'})
           })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-20
   * @detail   下拉选项绑定
   * @return   {[type]}     [description]
   */
  bindChange(e) {
    const key = e.currentTarget.dataset.key
    this.setData({
      [key]: parseInt(e.detail.value),
      [`selected_${key}`]: true
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-21
   * @detail   修改公司简称
   * @return   {[type]}   [description]
   */
  jumpModifyIntro() {
    wx.navigateTo({
      url: `${RECRUITER}user/company/abbreviation/abbreviation`,
      success: () => {
        this.saveFormData()
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-21
   * @detail   保存当前页面的编辑数据
   * @return   {[type]}   [description]
   */
  saveFormData() {
    wx.setStorage({
      key: 'createCompanyInfos',
      data: this.data
    })
  }
})