import { loginApi } from '../../../../api/pages/auth.js';

const app = getApp()

Page({
	data: {
    email: '15999972494',
  	password: '123456'
  },
  onShow() {
    console.log(wx.getStorageSync('token'))
  },
  bindInput(e) {
  	let field = e.currentTarget.dataset.field
    this.setData({
      [field]: e.detail.value
    })
  },
	submit(e) {
    const form = e.detail.value
    loginApi(form)
      .then(res => {
        wx.setStorageSync('token', res.data.token)
        wx.switchTab({url: '/page/applicant/pages/index/index'})
      })
  }
})
