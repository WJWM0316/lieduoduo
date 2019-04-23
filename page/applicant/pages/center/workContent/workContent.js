import {workContentReg} from '../../../../../utils/fieldRegular.js'
const app = getApp()
let workContent = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowInputNum: 0,
    content: '',
    cdnImagePath: app.globalData.cdnImagePath,
    showCase: false // 是否展示例子
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let content = wx.getStorageSync('workContent')
    if (content) {
      this.setData({content}, () => {
        wx.removeStorageSync('workContent')
      })
    }
  },
  /* 切换例子 */
  nextExample () {
  },
  /* 展示或关闭例子 */
  showPopups () {
    this.setData({
      showCase: !this.data.showCase
    })
  },
  /* 实时监听输入 */
  WriteContent (e) {
    workContent = e.detail.value
   this.setData({
     nowInputNum: e.detail.value.length
   })
  },
  send () {
    if (workContent) {
      if (!workContentReg.test(workContent)) {
        app.wxToast({title: '工作内容需为10-1000个字符'})
        return
      }
      wx.setStorageSync('workContent', workContent)
    } else {
      app.wxToast({title:'工作内容不能为空'})
      return
    }
    wx.navigateBack({
      delta: 1
    })
  }
})