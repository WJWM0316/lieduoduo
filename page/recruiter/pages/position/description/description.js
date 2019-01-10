import {RECRUITER} from '../../../../../config.js'

const app = getApp()

Page({
	data: {
		describe: '',
    canClick: false
	},
	onLoad(options) {
    const storage = wx.getStorageSync('createPosition')
    if(storage.describe) this.setData({ describe: storage.describe, canClick: true })
	},
	/**
	 * @Author   小书包
	 * @DateTime 2018-12-25
	 * @detail   绑定文本域输入
	 * @return   {[type]}     [description]
	 */
  bindTextAreaInput(e) {
  	this.setData({describe: e.detail.value})
    this.bindButtonStatus()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-10
   * @detail   绑定按钮的状态
   * @return   {[type]}   [description]
   */
  bindButtonStatus() {
    this.setData({canClick: this.data.describe})
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