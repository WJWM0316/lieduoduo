import { applyCompanyApi, getCompanyNameListApi } from '../../../../../../api/pages/company.js'

import {realNameReg, emailReg, positionReg} from '../../../../../../utils/fieldRegular.js'

import {RECRUITER} from '../../../../../../config.js'

const app = getApp()

Page({
  data: {
    company_name: '',
    canClick: false,
    nameList: []
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
   * @DateTime 2018-12-21
   * @detail   绑定用户输入
   * @return   {[type]}     [description]
   */
  bindInput(e) {
    this.setData({company_name: e.detail.value})
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-21
   * @detail   选择公司
   * @return   {[type]}   [description]
   */
  selectCompany(e) {
    const name = e.currentTarget.dataset.name
    this.setData({canClick: true, company_name: name})
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
  submit() {
    const storage = wx.getStorageSync('createdCompany')
    if(!this.data.canClick) return;
    storage.company_name = this.data.company_name
    wx.setStorageSync('createdCompany', storage)
    wx.navigateTo({url: `${RECRUITER}user/company/post/post`})
  }
})