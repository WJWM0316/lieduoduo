import {RECRUITER} from '../../../../../config.js'

const app = getApp()

Page({
	data: {
		describe: ''
	},
	onLoad(options) {
		wx.getStorage({
      key: 'positionDescribe',
      success: res => {
        this.setData({ describe: res.data })
      }
    })
	},
	/**
	 * @Author   小书包
	 * @DateTime 2018-12-25
	 * @detail   绑定文本域输入
	 * @return   {[type]}     [description]
	 */
  bindTextAreaInput(e) {
  	this.setData({describe: e.detail.value})
  },
  formSubmit(e) {
    wx.setStorage({
      key: 'positionDescribe',
      data: this.data.describe,
      success: () => {
      	wx.navigateTo({url: `${RECRUITER}position/post/post`})
      }
    })
  }
})