import {abbreviationReg} from '../../../../../../utils/fieldRegular.js'

import {RECRUITER} from '../../../../../../config.js'

const app = getApp()

Page({
  data: {
    intro: '',
    canClick: false
  },
  onShow() {
    this.init()
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-21
   * @detail   初始化页面
   * @return   {[type]}   [description]
   */
  init() {
    const intro = wx.getStorageSync('intro')
    if(!intro) return;
    this.setData({canClick: true, intro})
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-20
   * @detail   绑定按钮的状态
   * @return   {[type]}   [description]
   */
  bindBtnStatus() {
    const canClick = abbreviationReg.test(this.data.intro) ? true : false
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
    this.setData({
      [field]: e.detail.value
    })
    this.bindBtnStatus()
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-21
   * @detail   保存并回到之前的页面
   * @return   {[type]}   [description]
   */
  submit() {
    if(!this.data.intro) return;
    wx.setStorageSync('intro', this.data.intro)
    wx.navigateTo({
      url: `${RECRUITER}user/company/post/post`
    })
  }
})