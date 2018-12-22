import { applyCompanyApi } from '../../../../../../api/pages/certification.js'

import {realNameReg, emailReg, positionReg} from '../../../../../../utils/fieldRegular.js'

import {RECRUITER} from '../../../../../../config.js'

const app = getApp()

Page({
  data: {
    company_name: '',
    canClick: false
  },
  onLoad() {
    getApp().globalData.identity = 'RECRUITER'
    this.init()
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-21
   * @detail   初始化页面数据
   * @return   {[type]}   [description]
   */
  init() {
    wx.getStorage({
      key: 'createdCompanyName',
      success: res => {
        const params = ['company_name', 'canClick']
        params.map(field => this.setData({ [field]: res.data[field] }))
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-21
   * @detail   绑定用户输入
   * @return   {[type]}     [description]
   */
  bindInput(e) {
    console.log(e.detail.value)
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
      key: 'createdCompanyName',
      data: this.data
    })
  },
  submit() {
    if(!this.data.canClick) return;
    wx.navigateTo({
      url: `${RECRUITER}user/company/post/post`,
      success: () => {
        this.saveFormData()
      }
    })
  }
})