import {
  sendEmailApi,
  verifyEmailApi
} from '../../../../../../api/pages/company.js'

import {emailReg} from '../../../../../../utils/fieldRegular.js'

import {RECRUITER} from '../../../../../../config.js'

const app = getApp()

Page({
  data: {
    email: '',
    step: 1,
    code: '',
    codeLength: 6,
    isFocus: true,
    ispassword: false,
    canClick: false,
    options: {},
    showTips: false,
    error: false,
    telePhone: app.globalData.telePhone,
    isEmail: false,
    time: 5,
    timer: null,
    canResend: true
  },
  onLoad(ontions) {
    this.setData({ontions})
  },
  onHide() {
    let timer = this.data.timer
    clearInterval(timer)
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-20
   * @detail   绑定按钮的状态
   * @return   {[type]}   [description]
   */
  bindBtnStatus() {
    let canClick = false
    if(emailReg.test(this.data.code)) {
      canClick = true
    } else {
      canClick = false
    }
    this.setData({ canClick })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-20
   * @detail   动态输入
   * @return   {[type]}     [description]
   */
  bindInput(e) {
    let isEmail = this.data.isEmail
    let email = e.detail.value
    isEmail = emailReg.test(email)
    this.setData({email, isEmail})
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-22
   * @detail   发送验证码
   * @return   {[type]}   [description]
   */
  sendEmail() {
    // let params = {email: this.data.code, company_id: this.data.ontions.id}
    let params = {email: this.data.email, company_id: 88}
    if(this.data.step === 2) {
      sendEmailApi(params).then(res => this.setData({canResend: false }))
    } else {
      sendEmailApi(params).then(res => this.setData({step: 2}))
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-22
   * @detail   重新发送验证码
   * @return   {[type]}   [description]
   */
  reEmail() {
    console.log(this.data)
    // let params = {email: this.data.code, company_id: this.data.ontions.id}
    let params = {email: this.data.email, company_id: 88}
    // 已经进入倒计时
    if(!this.data.canResend) return;
    this.setData({canResend: false })
    sendEmailApi(params).then(res => {
      let timer = this.data.timer
      let time = this.data.time
      timer = setInterval(() => {
        time--
        if(time < 1) {
          clearInterval(timer)
          this.setData({canResend: true, time: 5})
        } else {
          this.setData({time})
        }
      }, 1000)
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-08
   * @detail   输入框有的焦点
   * @return   {[type]}     [description]
   */
  onFocus(e) {
    let code = e.detail.value
    this.setData({code: code}, () => {
      this.bindBtnStatus()
      if(code.length > 5) this.verifyEmail()
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-08
   * @detail   点击输入框
   */
  onTap(e) {
    this.setData({ isFocus: true })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-08
   * @detail   验证邮箱
   * @return   {[type]}     [description]
   */
  verifyEmail() {
    // let params = {email: this.data.email, company_id: this.data.ontions.id, code: this.data.code}
    let params = {email: this.data.email, company_id: 88, code: this.data.code}
    verifyEmailApi(params).then(res => {
      wx.redirectTo({url: `${RECRUITER}user/company/status/status?from=identity`})
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-08
   * @detail   开启弹窗显示
   * @return   {[type]}   [description]
   */
  tapShow() {
    this.setData({showTips: !this.data.showTips})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-08
   * @detail   使用其他验证方式
   * @return   {[type]}   [description]
   */
  changeIndentifyMethods() {
    wx.redirectTo({url: `${RECRUITER}user/company/identityMethods/identityMethods`})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-08
   * @detail   拨打电话
   * @return   {[type]}   [description]
   */
  callPhone() {
    wx.makePhoneCall({phoneNumber: app.globalData.telePhone})
  }
})