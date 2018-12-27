import {RECRUITER} from '../../../../../config.js'

const app = getApp()

Page({
  data: {
    keyword: ''
  },
  onLoad(options) {
    // 粗暴实现是否已编辑
    wx.getStorage({
      key: 'createPosition',
      success: res => this.setData({keyword: res.data.position_name})
    })
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
    wx.navigateTo({url: `${RECRUITER}position/post/post?position_name=${this.data.keyword}`})
  }
})