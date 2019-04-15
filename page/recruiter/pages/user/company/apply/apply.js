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
  editCompanyFirstStepApi,
  hasApplayRecordApi
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
    height: 0,
    applyJoin: false
  },
  onLoad(options) {
    this.setData({options})
  },
  onShow() {
    let options = this.data.options
    this.getBannerHeight()
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
    let applyJoin = this.data.applyJoin
    getCompanyIdentityInfosApi({hasLoading}).then(res => {
      let companyInfo = res.data.companyInfo
      let status = companyInfo.status
      applyJoin = res.data.applyJoin
      let formData = {
        real_name: storage.real_name || companyInfo.realName,
        user_email: storage.user_email || companyInfo.userEmail,
        user_position: storage.user_position || companyInfo.userPosition,
        company_name: storage.company_name || companyInfo.companyName
      }
      // 重新编辑 加公司id
      if(options.action && options.action === 'edit') formData = Object.assign(formData, {id: companyInfo.id})
      if(applyJoin) formData = Object.assign(formData, {applyId: companyInfo.applyId})
      this.setData({formData, canClick: true, applyJoin, status})
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
    let bindKeys = ['real_name', 'user_position', 'user_email', 'company_name']
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
    let options = this.data.options
    let action = ''
    let applyJoin = this.data.applyJoin
    let storage = wx.getStorageSync('createdCompany') || {} 

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

    Promise.all([
      checkRealName,
      checkUserEmail,
      checkUserPosition
    ])
    .then(res => {
      if(options.action && options.action === 'edit') {
        // 对于已有的数据 直接编辑 编辑加入或者创建的信息
        action = applyJoin ? 'editJoinCompany' : 'editCreateCompany'
        this[action]()
      } else {
        this.createCompany()
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
  joinCompany(infos) {
    let formData = Object.assign(wx.getStorageSync('createdCompany'), this.data.formData)
    let params = {
      real_name: formData.real_name,
      user_email: formData.user_email,
      user_position: formData.user_position,
      company_name: formData.company_name,
      company_id: infos.companyId
    }
    hasApplayRecordApi({company_id: infos.companyId}).then(res => {
      // 当前公司已经申请过
      if(res.data.id) {
        this.editJoinCompany()
      } else {
        applyCompanyApi(params).then(res => {
          wx.removeStorageSync('createdCompany')
          if(res.data.emailStatus) {
            wx.reLaunch({url: `${RECRUITER}user/company/identityMethods/identityMethods?from=join&suffix=${res.data.suffix}&companyId=${res.data.companyId}`})
          } else {
            wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=join`})
          }
        })
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-11
   * @detail   编辑申请加入公司
   * @return   {[type]}   [description]
   */
  editJoinCompany() {
    let formData = Object.assign(wx.getStorageSync('createdCompany'), this.data.formData)
    let params = {
      id: formData.applyId,
      real_name: formData.real_name,
      user_email: formData.user_email,
      user_position: formData.user_position,
      company_name: formData.company_name,
      company_id: formData.id
    }
    // 判断公司是否存在
    justifyCompanyExistApi({name: formData.company_name}).then(res => {
      if(res.data.exist) {
        // 有可能编辑时  加入另一家公司
        params = Object.assign(params, {company_id: res.data.id})
        // 被拒绝并且是新公司
        if(formData.id !== res.data.id) {
          this.joinCompany({companyId: res.data.id})
        } else {
          editApplyCompanyApi(params).then(res => {
            wx.removeStorageSync('createdCompany')
            if(res.data.emailStatus) {
              wx.reLaunch({url: `${RECRUITER}user/company/identityMethods/identityMethods?from=join&suffix=${res.data.suffix}&companyId=${res.data.companyId}`})
            } else {
              wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=join`})
            }
          })
        }
      } else {
        this.createCompany()
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-11
   * @detail   申请加入公司
   * @return   {[type]}   [description]
   */
  createCompany() {
    let formData = Object.assign(wx.getStorageSync('createdCompany'), this.data.formData)
    let params = {
      real_name: formData.real_name,
      user_email: formData.user_email,
      user_position: formData.user_position,
      company_name: formData.company_name
    }
    createCompanyApi(params).then(res => {
      wx.reLaunch({url: `${RECRUITER}user/company/createdCompanyInfos/createdCompanyInfos?from=company`})
      wx.removeStorageSync('createdCompany')
    })
    // 公司存在 直接走加入流程
    .catch(err => {
      if(err.code === 990) this.joinCompany({companyId: err.data.id})
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
    // 创建公司后 重新编辑走加入公司逻辑  如果之前有一条加入记录 取之前的加入记录id
    .catch(err => {
      hasApplayRecordApi().then(res => {
        let formData = this.data.formData
        if(res.data.id) {
          formData.applyId = res.data.id
          formData.id = res.data.companyId
          this.setData({formData}, () => this.editJoinCompany())
        } else {
          if(err.code === 990) this.joinCompany({companyId: err.data.id})
        }
      })
    })
  },
})