// page/recruiter/pages/company/baseEdit/baseEdit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logoUrl: '',
    logoId: '',
    financingId: '',
    financingDesc: '',
    staffMembersId: '',
    staffMembersDesc: '',
    website: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getResult(e) {
    switch(e.currentTarget.dataset.type) {
      case 'financing':
        this.setData({
          financingId: e.detail.propsResult,
          financingDesc: e.detail.propsDesc
        })
        break
      case 'staffMembers':
        this.setData({
          staffMembersId: e.detail.propsResult,
          staffMembersDesc: e.detail.propsDesc
        })
        break
      case 'img':
        this.setData({
          logoUrl: e.detail.data[0].middleUrl,
          logoId: e.detail.data[0].id
        })
        break
    }
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