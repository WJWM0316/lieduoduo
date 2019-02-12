import { identityCompanyApi, getCompanyIdentityInfosApi, editCompanyIdentityInfosApi } from '../../../../../../api/pages/company.js'

import {realNameReg, idCardReg} from '../../../../../../utils/fieldRegular.js'

import {RECRUITER} from '../../../../../../config.js'

const app = getApp()

Page({
  data: {
    real_name: '',
    identity_num: '',
    passport_front: {
      smallUrl: ''
    },
    passport_reverse: {
      smallUrl: ''
    },
    handheld_passport: {
      smallUrl: ''
    },
    cdnImagePath: app.globalData.cdnImagePath,
    canClick: false,
    options: {},
    validity_start: '',
    validity_end: '',
    applyJoin: false
  },
  onLoad(options) {
    this.setData({options, real_name: options.realName ? options.realName : ''})
    if(options.action && options.action === 'edit') this.getCompanyIdentityInfos()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-10
   * @detail   获取认证详情
   * @return   {[type]}   [description]
   */
  getCompanyIdentityInfos() {
    getCompanyIdentityInfosApi().then(res => {
      const infos = res.data
      const formData = {}
      const options = this.data.options
      const data = this.data
      if(!infos.handheldPassportInfo.smallUrl) delete options.action
      formData.real_name = infos.realName ? infos.realName : ''
      formData.identity_num = infos.identityNum ? infos.identityNum : ''
      formData.validity = infos.validity ? infos.validity : ''
      formData.passport_front = infos.passportFrontInfo.smallUrl ? infos.passportFrontInfo : data.passport_front
      formData.passport_reverse = infos.passportReverseInfo.smallUrl ? infos.passportReverseInfo : data.passport_reverse
      formData.handheld_passport = infos.handheldPassportInfo.smallUrl ? infos.handheldPassportInfo : data.handheld_passport
      formData.applyJoin = res.data.applyJoin
      formData.validity_start = infos.validityStart
      formData.validity_end = infos.validityEnd
      formData.options = options
      Object.keys(formData).map(field => this.setData({[field]: formData[field]}))
      this.bindBtnStatus()
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-20
   * @detail   绑定按钮的状态
   * @return   {[type]}   [description]
   */
  bindBtnStatus() {
    const bindKeys = ['real_name', 'identity_num', 'validity_start', 'validity_end']
    let canClick = bindKeys.every(field => this.data[field])
    let hasUploadImage =
      canClick
      && this.data.passport_front.smallUrl
      && this.data.passport_reverse.smallUrl
      && this.data.handheld_passport.smallUrl
    this.setData({canClick})
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-20
   * @detail   日期选择
   * @return   {[type]}     [description]
   */
  getStartDate(e) {
    const validity_start = e.detail.value.replace(/-/g, '.')
    this.setData({validity_start})
    this.bindBtnStatus()
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-20
   * @detail   日期选择
   * @return   {[type]}     [description]
   */
  getEndDate(e) {
    const startTime = this.data.validity_start
    const timestamp1 = Date.parse(startTime)
    const timestamp2 = Date.parse(e.detail.value)
    const validity_end = e.detail.value.replace(/-/g, '.')
    if(!startTime) {
      app.wxToast({title: '请选择开始时间'})
      return
    }
    // 结束时间必须大于开始时间
    if(timestamp2 - timestamp1 > 0) {
      this.setData({validity_end})
      this.bindBtnStatus()
    } else {
      app.wxToast({title: '结束时间必须大于开始时间'})
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-21
   * @detail   图片上传
   * @return   {[type]}     [description]
   */
  upload(e) {
    const key = e.currentTarget.dataset.type
    this.setData({[key]: e.detail[0]})
    this.bindBtnStatus()
  },
  submit() {
    if(!this.data.canClick) return;

    // 验证用户名
    let checkRealName = new Promise((resolve, reject) => {
      !realNameReg.test(this.data.real_name) ? reject('姓名需为2-20个中文字符') : resolve()
    })
    
    // 验证身份证
    let checkIdCard = new Promise((resolve, reject) => {
      !idCardReg.test(this.data.identity_num) ? reject('请填写有效的身份证号') : resolve()
    })

    Promise.all([checkRealName, checkIdCard]).then(res => {
      const action = this.data.options.action === 'edit' ? 'editCompanyIdentityInfos' : 'identityCompany'
      this[action]()
   })
   .catch(err => app.wxToast({title: err}))
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
    formData.validity_end = this.data.validity_end.replace(/-/g, '.')
    formData.validity_start = this.data.validity_start.replace(/-/g, '.')
    return formData
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-22
   * @detail   身份认证 判断页面来源
   * @return   {[type]}   [description]
   */
  identityCompany() {
    const formData = this.getParams()
    identityCompanyApi(formData).then((res) => {
      const type = this.data.options.type === 'apply' ? 'apply' : 'company'
      wx.redirectTo({url: `${RECRUITER}user/company/status/status?from=${type}`})
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-22
   * @detail   身份认证
   * @return   {[type]}   [description]
   */
  editCompanyIdentityInfos() {
    const formData = this.getParams()
    editCompanyIdentityInfosApi(formData).then((res) => {
      wx.redirectTo({url: `${RECRUITER}user/company/status/status?from=identity`})
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-30
   * @detail   绑定用户输入
   * @return   {[type]}     [description]
   */
  bindInput(e) {
    const field = e.currentTarget.dataset.field
    this.setData({[field]: e.detail.value})
    this.bindBtnStatus()
  }
})