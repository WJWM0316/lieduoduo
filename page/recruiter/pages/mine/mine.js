import { getUserInfoApi } from '../../../../api/pages/user.js'
const app = getApp()

Page({
	data: {
    mobile: '',
  	realName: '',
  	eMail: '',
  	job: ''
  },
  onLoad() {
    getUserInfoApi()
    // getApp().checkLogin().then(res => {
    //   getUserInfoApi()
    //   this.setData({userInfo: res})
    // })
  },
  onShareAppMessage() {
    return {
      title: '自定义分享标题',
      desc: '自定义分享描述',
      path: '/page/user?id=123'
    }
  },
  share() {
    wx.showShareMenu({
      withShareTicket: true,
      success(e) {
        console.log(e, 1)
      },
      fail(e) {
        console.log(e, 2)
      }
    })
  },
  bindInput(e) {
  	let field = e.currentTarget.dataset.field
    this.setData({
      [field]: e.detail.value
    })
  },
	submit(e) {
    const form = e.detail.value
    console.log(form)
  }
})
