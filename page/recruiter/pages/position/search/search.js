import {
  getPositionNameListApi
} from '../../../../../api/pages/position.js'

import {RECRUITER} from '../../../../../config.js'

const app = getApp()

Page({
  data: {
    keyword: '',
    nameLists: [],
    canClick: false
  },
  // onLoad() {
  //   const storage = wx.getStorageSync('createPosition')
  //   if(storage) {
  //     this.setData({keyword: storage.position_name})
  //   }
  // },
  /**
   * @Author   小书包
   * @DateTime 2018-12-25
   * @detail   绑定用户输入
   * @return   {[type]}     [description]
   */
  bindInput(e) {
    getPositionNameListApi({name: e.detail.value})
      .then(res => {
        this.setData({nameLists: res.data})
      })
  },
  onClick(e) {
    const name = e.currentTarget.dataset.name
    const storage = wx.getStorageSync('createPosition')
    storage.position_name = name
    wx.setStorageSync('createPosition', storage)
    this.setData({canClick: true})
  },
  submit(e) {
    wx.navigateTo({url: `${RECRUITER}position/post/post`})
  }
})