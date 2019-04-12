import {realNameReg, emailReg, positionReg} from '../../../../../../utils/fieldRegular.js'

import {RECRUITER, COMMON, APPLICANT} from '../../../../../../config.js'

import {getSelectorQuery} from "../../../../../../utils/util.js"

import {
  applyCompanyApi,
  createCompanyApi,
  getCompanyNameListApi,
  justifyCompanyExistApi,
  editApplyCompanyApi,
  getCompanyIdentityInfosApi,
  editCompanyFirstStepApi
} from '../../../../../../api/pages/company.js'

let app = getApp()

Page({
  data: {
    formData: {
      real_name: '',
      user_email: '',
      user_position: '',
      company_name: ''
    },
    canClick: false,
    options: {},
    cdnImagePath: app.globalData.cdnImagePath,
    navH: app.globalData.navHeight,
    telePhone: app.globalData.telePhone,
    height: 0
  },
  onLoad(options) {
    this.setData({options})
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
  getCompanyIdentityInfos(hasLoading = true) {
    let storage = wx.getStorageSync('createdCompany') || {}
    let options = this.data.options
    getCompanyIdentityInfosApi({hasLoading}).then(res => {
      let infos = res.data.companyInfo
      let formData = {
        real_name: storage.real_name || infos.realName,
        user_email: storage.user_email || infos.userEmail,
        user_position: storage.user_position || infos.userPosition,
        company_name: storage.company_name || infos.companyName
      }
      // 重新编辑 加公司id
      if(options.action && options.action === 'edit') formData = Object.assign(formData, {id: infos.id})
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
    let options = this.data.options
    let action = ''
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
      wx.setStorageSync('createdCompany', Object.assign(storage, this.data.formData))
      // 信息重新编辑
      if(options.action && options.action === 'edit') {
        action = options.from && options.from === 'join' ? 'editJoinCompany' : 'editCreateCompany'
        this[action]()
      } else {
        action = options.from && options.from === 'join' ? 'joinCompany' : 'createCompany'
        this[action]()
      }
    })
    .catch(err => {
      console.log(err)
      // app.wxToast({title: err})
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-08
   * @detail   切换身份
   * @return   {[type]}   [description]
   */
  toggle() {
    app.toggleIdentity()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-08
   * @detail   更改手机
   * @return   {[type]}   [description]
   */
  changePhone() {
    app.wxConfirm({
      title: '换个账号',
      content: '退出后不会删除任何历史数据，下次登录依然可以使用本账号',
      confirmBack() {
        app.uplogin()
      },
      cancelBack: () => {}
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-08
   * @detail   拨打电话
   * @return   {[type]}   [description]
   */
  callPhone() {
    wx.makePhoneCall({phoneNumber: app.globalData.telePhone})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-08
   * @detail   获取公司名称
   * @return   {[type]}   [description]
   */
  getCompanyName() {
    let storage = wx.getStorageSync('createdCompany') || {}
    let options = this.data.options
    wx.setStorageSync('createdCompany', Object.assign(storage, this.data.formData))
    if(options.action && options.action === 'edit') {
      wx.navigateTo({url: `${RECRUITER}user/company/find/find?action=edit`})
    } else {
      wx.navigateTo({url: `${RECRUITER}user/company/find/find`})
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-11
   * @detail   申请加入公司
   * @return   {[type]}   [description]
   */
  joinCompany() {
    let storage = wx.getStorageSync('createdCompany')
    let infos = this.data.infos
    let params = {
      real_name: storage.real_name,
      user_email: storage.user_email,
      user_position: storage.user_position,
      company_name: storage.company_name,
      company_id: storage.company_id
    }
    params = Object.assign(params, this.data.formData)
    applyCompanyApi(params).then(() => {
      wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=join`})
      wx.removeStorageSync('createdCompany')
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-11
   * @detail   编辑申请加入公司
   * @return   {[type]}   [description]
   */
  editJoinCompany() {
    let storage = wx.getStorageSync('createdCompany')
    let id = storage.applyId
    let infos = this.data.infos
    let params = {
      id,
      real_name: storage.real_name,
      user_email: storage.user_email,
      user_position: storage.user_position,
      company_id: infos.id
    }
    editApplyCompanyApi(params).then(() => {
      wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=join`})
      wx.removeStorageSync('createdCompany')
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-11
   * @detail   申请加入公司
   * @return   {[type]}   [description]
   */
  createCompany() {
    let storage = wx.getStorageSync('createdCompany')
    let infos = this.data.infos
    let params = {
      real_name: storage.real_name,
      user_email: storage.user_email,
      user_position: storage.user_position,
      company_name: storage.company_name
    }
    params = Object.assign(params, this.data.formData)
    createCompanyApi(params).then(() => {
      wx.reLaunch({url: `${RECRUITER}user/company/createdCompanyInfos/createdCompanyInfos?from=company`})
      wx.removeStorageSync('createdCompany')
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-11
   * @detail   编辑申请加入公司
   * @return   {[type]}   [description]
   */
  editCreateCompany() {
    // 防止用户重新编辑
    let formData = Object.assign(wx.getStorageSync('createdCompany') || {}, this.data.formData)
    let params = {
      id: formData.id,
      real_name: formData.real_name,
      user_email: formData.user_email,
      user_position: formData.user_position,
      company_name: formData.company_name
    }
    editCompanyFirstStepApi(params).then(() => {
      wx.reLaunch({url: `${RECRUITER}user/company/createdCompanyInfos/createdCompanyInfos?from=company&action=edit`})
      wx.removeStorageSync('createdCompany')
    })
  },
})