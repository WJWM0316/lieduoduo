// page/applicant/pages/center/resumeEditor/aimsEdit/aimsEdit.js
import { editIntroduceApi } from '../../../../../../api/pages/center.js'
//let introduce = '' // 当前输入的内容
let upLoadList = '' // 装用于上传的图片id
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowInputNum: 0, // 当前输入字数
    imgList: [], // 图片数组
    introduce: '' // 当前输入的内容
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.resumeInfo.moreIntroduce)
//  introduce = app.globalData.resumeInfo.moreIntroduce.introduce
    if (options.id === 'undefined') {
      this.setData({
        isAdd: true,
        imgList: app.globalData.resumeInfo.moreIntroduce.imgs,
        introduce: app.globalData.resumeInfo.moreIntroduce.introduce
      })
    }
  },
  // 上传图片
  getResult (e) {
    let imgList = [...this.data.imgList, ...e.detail.data]
    this.setData({
      imgList
    })
  },
  delImg (e) {
//  console.log(e.currentTarget.dataset.imgindex)
    const index = e.currentTarget.dataset.imgindex
    this.data.imgList.splice(index,1)
    const imgList = this.data.imgList
    this.setData({
      imgList
    })
  },
  // 编辑自我介绍
  WriteContent (e) {
    this.data.introduce = e.detail.value
    this.setData({
      nowInputNum: e.detail.cursor,
      introduce: e.detail.value
    })
  },
  // 编辑保存
  save () {
    this.data.imgList.map((item, index) => {
      if (!upLoadList) {
        upLoadList = `${item.id}`
      } else {
        upLoadList = `${upLoadList},${item.id}`
      }
    })
    const param = {
      introduce: this.data.introduce,
      attachIds: upLoadList
    }
    editIntroduceApi(param).then(res => {
      app.globalData.resumeInfo.moreIntroduce.imgs = this.data.imgList
      app.globalData.resumeInfo.moreIntroduce.introduce = this.data.introduce
      wx.navigateBack({delta: 1})
    })
  }
})