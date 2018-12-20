import { applyCompanyApi } from '../../../../../api/pages/certification.js'
import {realNameReg, emailReg, positionReg} from '../../../../../utils/fieldRegular.js'

const app = getApp()

Page({
  data: {
    real_name: '你过来啊',
    user_email: '123@qq.com',
    user_position: '广州',
    company_id: 1
  },
  onLoad() {
    getApp().globalData.identity = 'RECRUITER'
  },
  bindInput(e) {
    let field = e.currentTarget.dataset.field
    this.setData({
      [field]: e.detail.value
    })
  },
  submit() {
    console.log(this.data.user_position)
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

    Promise.all([checkRealName, checkUserEmail, checkUserPosition])
           .then(res => {
              applyCompanyApi(this.form)
           })
           .catch(err => {
              wx.showToast({title: err, icon: 'none'})
           })
  }
})