import {RECRUITER} from '../../../../../config.js'

const app = getApp()

Page({
  data: {
    keyword: ''
  },
  onLoad(options) {
    if(options.positionName) {
      this.setData({keyword: options.positionName})
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-25
   * @detail   绑定用户输入
   * @return   {[type]}     [description]
   */
  bindInput(e) {
    this.setData({keyword: e.detail.value})
  },
  submit(e) {
    wx.navigateTo({url: `${RECRUITER}position/post/post?positionName=${this.data.keyword}`})
  }
})