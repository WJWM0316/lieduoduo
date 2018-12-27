import {abbreviationReg} from '../../../../../../utils/fieldRegular.js'

import {RECRUITER} from '../../../../../../config.js'

const app = getApp()

Page({
  data: {
    companyShortName: '',
    company_name: '',
    canClick: false
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-25
   * @detail   获取路由参数
   * @return   {[type]}           [description]
   */
  onLoad(options) {
    if(options.companyShortName) {
      this.setData({ companyShortName: options.companyShortName, canClick: true, company_name: options.company_name})
    } else {
      this.setData({company_name: options.company_name})
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-20
   * @detail   绑定按钮的状态
   * @return   {[type]}   [description]
   */
  bindBtnStatus() {
    const canClick = abbreviationReg.test(this.data.companyShortName) ? true : false
    this.setData({ canClick })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-20
   * @detail   动态输入
   * @return   {[type]}     [description]
   */
  bindInput(e) {
    this.setData({companyShortName: e.detail.value})
    this.bindBtnStatus()
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-21
   * @detail   保存并回到之前的页面
   * @return   {[type]}   [description]
   */
  submit() {
    if(!this.data.companyShortName) return;
    wx.navigateTo({url: `${RECRUITER}user/company/post/post?companyShortName=${this.data.companyShortName}&company_name=${this.data.company_name}`})
  }
})