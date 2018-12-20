import {
  getCompanyFinancingApi,
  getCompanyEmployeesApi,
  getLabelFieldApi
} from '../../../../../../api/pages/user.js'

import {realNameReg, emailReg, positionReg} from '../../../../../../utils/fieldRegular.js'

const app = getApp()

Page({
  data: {
    real_name: '',
    user_email: '',
    user_position: '',
    company_id: 1,
    canClick: false,
    companyFinance: {
      index: 0,
      list: []
    },
    companyEmployees: {
      index: 0,
      list: [
        {
          value: 1,
          text: 0
        }
      ]
    },
    companyLabelField: {
      index: 0,
      list: []
    }
  },
  onLoad() {
    getApp().globalData.identity = 'RECRUITER'
    getCompanyFinancingApi()
      .then(res => {
        const companyFinance = {index: 0, list: res.data}
        this.setData({ companyFinance })
      })
    getCompanyEmployeesApi()
      .then(res => {
        const list = res.data
        list.map(field => field.text = `${field.text}人`)
        let companyEmployees = {index: 0, list}
        this.setData({ companyEmployees })
      })
    getLabelFieldApi()
      .then(res => {
        const companyLabelField = {index: 0, list: res.data}
        this.setData({ companyLabelField })
        console.log(res.data)
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
    const value = this.data[key]
    value.index = parseInt(e.detail.value)
    this.setData({
      [key]: value
    })
  }
})