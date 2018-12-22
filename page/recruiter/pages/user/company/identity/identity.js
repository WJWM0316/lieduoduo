import { identityCompanyApi } from '../../../../../../api/pages/company.js'

import {realNameReg, idCardReg} from '../../../../../../utils/fieldRegular.js'

import {RECRUITER} from '../../../../../../config.js'

const app = getApp()

Page({
  data: {
    real_name: '李子发',
    identity_num: '452226199201282413',
    validity: '10',
    passport_front: {
      smallUrl: ''
    },
    passport_reverse: {
      smallUrl: ''
    },
    canClick: false
  },
  onLoad() {
    console.log(app)
    getApp().globalData.identity = 'RECRUITER'
    // this.init()
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-21
   * @detail   初始化页面
   * @return   {[type]}   [description]
   */
  init() {
    wx.getStorage({
      key: 'createdCompanyBase',
      success: res => {
        const params = ['real_name', 'user_email', 'user_position', 'canClick']
        params.map(field => this.setData({ [field]: res.data[field] }))
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-20
   * @detail   绑定按钮的状态
   * @return   {[type]}   [description]
   */
  bindBtnStatus() {
    const bindKeys = ['real_name', 'identity_num', 'validity']
    let canClick = bindKeys.every(field => this.data[field])
    canClick = this.data.passport_front.smallUrl && this.data.passport_reverse.smallUrl
    this.setData({ canClick })
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
  submit() {
    if(!this.data.canClick) return;

    // 验证用户名
    let checkRealName = new Promise((resolve, reject) => {
      !realNameReg.test(this.data.real_name) ? reject('请填写有效的姓名') : resolve()
    })

    // 验证邮箱
    let checkUserEmail = new Promise((resolve, reject) => {
      !idCardReg.test(this.data.identity_num) ? reject('请填写有效的身份证号') : resolve()
    })

    Promise.all([checkRealName, checkUserEmail])
           .then(res => {
              this.identityCompany()
           })
           .catch(err => {
              app.wxToast({title: err})
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
      key: 'createdCompanyBase',
      data: this.data
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-22
   * @detail   获取提交信息
   * @return   {[type]}   [description]
   */
  getParams() {
    const formData = {}
    formData.real_name = this.data.real_name
    formData.identity_num = this.data.identity_num
    formData.passport_front = this.data.passport_front.id
    formData.passport_reverse = this.data.passport_reverse.id
    if(this.data.validity) formData.validity = this.data.validity
    return formData
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-22
   * @detail   身份认证
   * @return   {[type]}   [description]
   */
  identityCompany() {
    const formData = this.getParams()
    identityCompanyApi(formData)
      .then((res) => {
        wx.navigateTo({
          url: `${RECRUITER}user/company/status/status`,
          success: () => {
            this.saveFormData()
          }
        })
      })
      .catch(err => {

      })
  }
})