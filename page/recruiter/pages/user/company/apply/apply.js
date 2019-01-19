import { getCompanyIdentityInfosApi } from '../../../../../../api/pages/company.js'

import {realNameReg, emailReg, positionReg} from '../../../../../../utils/fieldRegular.js'

import {RECRUITER} from '../../../../../../config.js'

const app = getApp()

Page({
  data: {
    real_name: '',
    user_email: '',
    user_position: '',
    canClick: false,
    options: {
      type: 'create'
    },
    cdnImagePath: app.globalData.cdnImagePath
  },
  onLoad(options) {
    const storage = wx.getStorageSync('createdCompany')
    const params = ['real_name', 'user_email', 'user_position']

    // 编辑页面
    if(options.action && options.action === 'edit') {
      this.getCompanyIdentityInfos(options)
      return;
    }
    if(!storage) return
    params.map(field => this.setData({ [field]: storage[field] }))
    this.bindBtnStatus()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-12
   * @detail   获取编辑详情
   * @return   {[type]}   [description]
   */
  getCompanyIdentityInfos(options) {

    const storage = wx.getStorageSync('createdCompany')
    const params = ['real_name', 'user_email', 'user_position']
    // 当编辑页面已经存在缓存时，不能再无谓的请求接口
    if(storage) {
      params.map(field => this.setData({ [field]: storage[field] }))
      this.bindBtnStatus()
      return
    }

    getCompanyIdentityInfosApi()
      .then(res => {
        const infos = res.data.companyInfo
        const formData = {
          real_name: infos.realName,
          user_email: infos.userEmail,
          user_position: infos.userPosition,
          company_name: infos.companyName,
          companyShortName: infos.companyShortname,
          industry_id: infos.industryId,
          industry_id_name: infos.industry,
          selected_industry_id: true,
          financing: infos.financing,
          financingName: infos.financingInfo,
          selected_financing: true,
          employees: infos.employees,
          employeesName: infos.employeesInfo,
          selected_employees: true,
          business_license: infos.businessLicenseInfo,
          on_job: infos.onJobInfo,
          options,
          canClick: true
        }
        wx.setStorageSync('createdCompany', formData)
        Object.keys(formData).map(field => this.setData({[field]: formData[field]}))
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
    this.setData({[field]: e.detail.value})
    this.bindBtnStatus()
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-25
   * @detail   保存当前页面的数据
   * @return   {[type]}   [description]
   */
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

    Promise
      .all([checkRealName, checkUserEmail, checkUserPosition])
      .then(res => {
        const options = this.data.options
        const url = options.action && options.action === 'edit'
          ? `${RECRUITER}user/company/find/find?action=edit&type=${options.type}`
          : `${RECRUITER}user/company/find/find`
        wx.navigateTo({url})
        wx.setStorageSync('createdCompany', this.data)
      })
      .catch(err => {
        app.wxToast({title: err})
      })
  }
})