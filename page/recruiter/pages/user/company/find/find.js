import { applyCompanyApi } from '../../../../../../api/pages/company.js'

import {realNameReg, emailReg, positionReg} from '../../../../../../utils/fieldRegular.js'

import {RECRUITER} from '../../../../../../config.js'

const app = getApp()

Page({
  data: {
    company_name: '',
    real_name: '',
    user_email: '',
    user_position: '',
    canClick: false
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-25
   * @detail   初始化页面数据
   * @return   {[type]}           [description]
   */
  onLoad(options) {
    getApp().globalData.identity = 'RECRUITER'
    if(options.company_name) {
      this.setData({company_name: options.company_name, canClick: true})
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-21
   * @detail   绑定用户输入
   * @return   {[type]}     [description]
   */
  bindInput(e) {
    // this.setData({company_name: e.detail.value})
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
    wx.setStorage({
      key: 'createdCompany_name',
      data: this.data
    })
  },
  submit() {
    if(!this.data.canClick) return;
    console.log(111)
    wx.navigateTo({url: `${RECRUITER}user/company/post/post?company_name=${this.data.company_name}`})
    this.saveFormData()
  }
})