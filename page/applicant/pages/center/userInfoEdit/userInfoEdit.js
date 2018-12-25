import {editBaseInfoApi} from '../../../../../api/pages/center.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    gender: 0,
    birth: 0,
    startWorkYear: 0,
    jobStatus: 0,
    mobile: '',
    wechat: '',
    signature: '',
    tabsList: ['测试1', '测试1', '测试1', '测试1', '测试1', '测试1'],
    signNum: 0,
    avatarUrl: '',
    options: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.avatarUrl) {
      this.setData({options, avatarUrl: options.avatarUrl})
    }
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
    console.log(e)
    let type = ''
    switch (e.target.dataset.type) {
      case 'birthday':
        type = 'birth'
        break
      case 'workTime':
        type = 'startWorkYear'
        break
      case 'jobStatus':
        type = 'jobStatus'
        break
    }
    this.setData({[type]: e.detail.propsResult})
  },
  getInputValue(e) {
    let type = ''
    switch (e.target.dataset.type) {
      case 'name':
        type = 'userName'
        break
      case 'mobile':
        type = 'mobile'
        break
      case 'wechat':
        type = 'wechat'
        break
    }
    this.setData({[type]: e.detail.value})
  },
  singInput(e) {
    this.setData({signNum: e.detail.value.length, signature: e.detail.value})
  },
  saveInfo() {
    let info = this.data
    let data = {
      avatar: info.options.avatarId,
      name: info.userName,
      gender: info.gender,
      birth: '2018/10/10', // info.birth, 
      startWorkYear: '2018/10/10', // info.startWorkYear,
      jobStatus: info.jobStatus,
      mobile: info.mobile,
      wechat: info.wechat,
      signature: info.signature
    }
    editBaseInfoApi(data).then(res => {
      getApp().wxToast({
        title: '保存成功',
        icon: 'success',
        callback() {
          wx.redirectTo({
            url: '/page/applicant/pages/center/mine/mine'
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