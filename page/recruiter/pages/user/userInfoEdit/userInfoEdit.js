import {saveRecruiterInfoApi} from '../../../../../api/pages/recruiter.js'
import {removeFileApi} from '../../../../../api/pages/common.js'
let userInfo = null
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    gender: 0,
    position: '',
    email: '',
    wechat: '',
    signature: '',
    picList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = app.globalData.recruiterDetails
    this.setData({
      userName: userInfo.name,
      gender: userInfo.gender,
      position: userInfo.position,
      email: userInfo.email,
      wechat: userInfo.wechat,
      signature: userInfo.signature,
      picList: [userInfo.avatar]
    })
  },
  jumpLabel() {
    wx.navigateTo({
      url: `/page/common/pages/tabsPage/tabsPage`
    })
  },
  radioChange(e) {
    this.setData({gender: parseInt(e.detail.value)})
  },
  getResult(e) {
    let picList = this.data.picList
    picList = picList.concat(e.detail)
    this.setData({picList})
  },
  getInputValue(e) {
    let type = ''
    switch (e.target.dataset.type) {
      case 'name':
        type = 'userName'
        break
      case 'position':
        type = 'position'
        break
      case 'email':
        type = 'email'
        break
      case 'wechat':
        type = 'wechat'
        break
    }
    this.setData({[type]: e.detail.value})
  },
  singInput(e) {
    this.setData({signature: e.detail.value})
  },
  removeFile(e) {
    let picList = this.data.picList
    picList.splice(e.currentTarget.dataset.index, 1)
    this.setData({picList})
    // let data = {
    //   id: e.currentTarget.dataset.id
    // }
    // removeFileApi(data).then(res => {
    //   let picList = this.data.picList 
    // })
  },
  saveInfo() {
    let info = this.data
    let idList = []
    info.picList.map((item, index) => {
      idList.push(item.id)
    })
    let data = {
      attachIds: idList.join(','),
      gender: info.gender,
      name: info.userName,
      position: info.position,
      email: info.email,
      wechat: info.wechat,
      signature: info.signature
    }
    saveRecruiterInfoApi(data).then(res => {
      app.wxToast({
        title: '保存成功',
        icon: 'success',
        callback() {
          app.globalData.recruiterDetails.avatar = info.picList[0]
          app.globalData.recruiterDetails.avatars = info.picList
          app.globalData.recruiterDetails.gender = info.gender
          app.globalData.recruiterDetails.name = info.userName
          app.globalData.recruiterDetails.position = info.position
          app.globalData.recruiterDetails.email = info.email
          app.globalData.recruiterDetails.wechat = info.wechat
          app.globalData.recruiterDetails.signature = info.signature
          wx.navigateBack({
            delta: 1
          })
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let avatarUrl = wx.getStorageSync('avatarUrl')
    let avatarId = wx.getStorageSync('avatarId')
    if (avatarUrl && avatarId) {
      this.setData({avatarUrl: avatarUrl, avatarId: avatarId})
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})