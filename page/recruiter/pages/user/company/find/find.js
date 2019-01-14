import {
  applyCompanyApi,
  getCompanyNameListApi,
  justifyCompanyExistApi
} from '../../../../../../api/pages/company.js'

import {realNameReg, emailReg, positionReg} from '../../../../../../utils/fieldRegular.js'

import {RECRUITER} from '../../../../../../config.js'

const app = getApp()

Page({
  data: {
    company_name: '',
    canClick: false,
    showMaskBox: false,
    nameList: []
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-11
   * @detail   防抖
   * @return   {[type]}   [description]
   */
  debounce(fn, context, delay, text) {
    clearTimeout(fn.timeoutId)
    fn.timeoutId = setTimeout(() => fn.call(context, text), delay)
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-25
   * @detail   初始化页面数据
   * @return   {[type]}           [description]
   */
  onLoad(options) {
    const storage = wx.getStorageSync('createdCompany')
    const params = ['real_name', 'user_email', 'user_position', 'canClick']
    if(!storage) return
    if(storage.company_name) this.setData({company_name: storage.company_name, canClick: true})
  },
/**
 * @Author   小书包
 * @DateTime 2019-01-11
 * @detail   绑定按钮的状态
 * @return   {[type]}   [description]
 */
  bindButtonStatus() {
    this.setData({canClick: this.data.company_name ? true : false})
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-21
   * @detail   绑定用户输入
   * @return   {[type]}     [description]
   */
  bindInput(e) {
    const name = e.detail.value
    this.debounce(this.getCompanyNameList, null, 500, name)
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-21
   * @detail   获取公司名字列表
   * @return   {[type]}     [description]
   */
  getCompanyNameList(name) {
    this.setData({company_name: name})
    this.bindButtonStatus()
    getCompanyNameListApi({name})
      .then(res => {
        const nameList = res.data
        nameList.map(field => {
          field.html = field.companyName.replace(new RegExp(name,'g'),`<span style="color: #652791;">${name}</span>`)
          field.html = `<div>${field.html}</div>`
        })
        this.setData({nameList})
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-21
   * @detail   选择公司
   * @return   {[type]}   [description]
   */
  selectCompany(e) {
    const name = e.currentTarget.dataset.name
    this.setData({canClick: true, company_name: name, nameList: []})
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-21
   * @detail   保存当前页面的编辑数据
   * @return   {[type]}   [description]
   */
  saveFormData() {
    const storage = wx.getStorageSync('createdCompany')
    storage.company_name = this.data.company_name
    wx.setStorageSync('createdCompany', storage)
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-03
   * @detail   公司搜索
   * @return   {[type]}   [description]
   */
  search() {
    getCompanyNameListApi({name: this.data.company_name})
      .then(res => {
        this.setData({nameList: res.data})
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-08
   * @detail   关闭弹窗
   * @return   {[type]}   [description]
   */
  closeMask() {
    const storage = wx.getStorageSync('createdCompany')
    storage.company_name = this.data.company_name
    wx.setStorageSync('createdCompany', storage)
    wx.navigateTo({url: `${RECRUITER}user/company/post/post`})
    this.setData({showMaskBox: false})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-11
   * @detail   申请加入公司
   * @return   {[type]}   [description]
   */
  applyCompany(companyId) {
    const storage = wx.getStorageSync('createdCompany')
    const params = {
      real_name: storage.real_name,
      user_email: storage.user_email,
      user_position: storage.user_position,
      company_id: companyId
    }
    applyCompanyApi(params)
      .then(() => {
        wx.navigateTo({url: `${RECRUITER}user/company/identity/identity?from=apply`})
        wx.removeStorageSync('createdCompany')
      })
  },
  submit() {
    if(!this.data.canClick) return;
    justifyCompanyExistApi({name: this.data.company_name})
      .then(res => {
        if(res.data.exist) {
          this.applyCompany(res.data.id)
        } else {
          this.setData({showMaskBox: true})
        }
      })
  }
})