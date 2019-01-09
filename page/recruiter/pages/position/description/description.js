import {RECRUITER} from '../../../../../config.js'

const app = getApp()

Page({
	data: {
		describe: ''
	},
	onLoad(options) {
    const storage = wx.getStorageSync('createPosition')
    this.setData({ describe: storage ? storage.describe : '' })
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
  submit(e) {
    const storage = wx.getStorageSync('createPosition')
    storage.describe = this.data.describe
    wx.setStorageSync('createPosition', storage)
    wx.navigateTo({url: `${RECRUITER}position/post/post`})
  },
  change(e) {
  	console.log(e)
  }
})