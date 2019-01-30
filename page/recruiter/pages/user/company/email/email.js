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
    Length: 6,
    isFocus: true,
    Value: '',
    ispassword: false,
    canClick: false
  },
  onLoad(ontions) {
    this.setData({ontions})
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-20
   * @detail   绑定按钮的状态
   * @return   {[type]}   [description]
   */
  bindBtnStatus() {
    const canClick = emailReg.test(this.data.email) ? true : false
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
  checkEmail() {
    if(!emailReg.test(this.data.email)) {
      app.wxToast({title: '请填写有效的邮箱'})
    } else {
      sendEmailApi({email: this.data.email, company_id: this.data.ontions.id}).then(res => {
        this.setData({ step: 2 })
      })
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-08
   * @detail   输入框有的焦点
   * @return   {[type]}     [description]
   */
  onFocus(e){
    this.setData({Value: e.detail.value})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-08
   * @detail   点击输入框
   */
  onTap(){
    this.setData({ isFocus: true })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-08
   * @detail   验证邮箱
   * @return   {[type]}     [description]
   */
  verifyEmail(e){
    verifyEmailApi({email: this.data.email, company_id: this.data.ontions.id, code: e.detail.value.password})
      .then(res => {
        wx.redirectTo({url: `${RECRUITER}user/company/status/status?from=identity`})
      })
  }
})