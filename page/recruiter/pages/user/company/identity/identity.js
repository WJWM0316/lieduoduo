import { identityCompanyApi } from '../../../../../../api/pages/company.js'

import {realNameReg, idCardReg} from '../../../../../../utils/fieldRegular.js'

import {RECRUITER} from '../../../../../../config.js'

const app = getApp()

Page({
  data: {
    real_name: '',
    identity_num: '',
    validity: '',
    passport_front: {
      smallUrl: ''
    },
    passport_reverse: {
      smallUrl: ''
    },
    handheld_passport: {
      smallUrl: ''
    },
    canClick: false
  },
  onLoad() {},
  /**
   * @Author   小书包
   * @DateTime 2018-12-20
   * @detail   绑定按钮的状态
   * @return   {[type]}   [description]
   */
  bindBtnStatus() {
    const bindKeys = ['real_name', 'identity_num', 'validity']
    let canClick = bindKeys.every(field => this.data[field])
    let hasUploadImage = this.data.passport_front.smallUrl && this.data.passport_reverse.smallUrl && this.data.handheld_passport.smallUrl
    this.setData({ canClick:  canClick && hasUploadImage})
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
    this.setData({ [key]: e.detail.data[0] })
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

    Promise
     .all([checkRealName, checkUserEmail])
     .then(res => {
        this.identityCompany()
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
    formData.handheld_passport = this.data.handheld_passport.id
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
        wx.navigateTo({url: `${RECRUITER}user/company/status/status`})
      })
  }
})