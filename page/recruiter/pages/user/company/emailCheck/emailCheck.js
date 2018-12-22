import { applyCompanyApi } from '../../../../../../api/pages/company.js'

import {emailReg} from '../../../../../../utils/fieldRegular.js'

import {RECRUITER} from '../../../../../../config.js'

const app = getApp()

Page({
  data: {
    prev_email: '',
    next_email: '',
    step: 1,
    code: '',
    canClick: false
  },
  onLoad() {
    getApp().globalData.identity = 'RECRUITER'
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-20
   * @detail   绑定按钮的状态
   * @return   {[type]}   [description]
   */
  bindBtnStatus() {
    const bindKeys = ['prev_email', 'next_email']
    let canClick = bindKeys.every(field => this.data[field])
    canClick = emailReg.test(`${this.data.prev_email}@${this.data.next_email}`) ? true : false
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
   * @DateTime 2018-12-22
   * @detail   detail
   * @return   {[type]}   [description]
   */
  submit() {
    if(!this.data.canClick) return;

    if(!emailReg.test(`${this.data.prev_email}@${this.data.next_email}`)) {
      app.wxToast({title: '请填写有效的邮箱'})
      return;
    }

    this.setData({ step: 2 })
    // wx.navigateTo({
    //   url: `${RECRUITER}user/company/find/find`
    // })
  }
})