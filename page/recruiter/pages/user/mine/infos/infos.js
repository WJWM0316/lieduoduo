import { getUserInfoApi } from '../../../../../../api/pages/user.js'
import {RECRUITER} from '../../../../../../config.js'

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
  /**
   * @Author   小书包
   * @DateTime 2018-12-19
   * @detail   前往更新用户资料
   * @return   {[type]}   [description]
   */
  jumpUpdateInfos() {
    wx.navigateTo({
      url: `${RECRUITER}user/mine/base/base`
    })
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
