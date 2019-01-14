import {getCompanyInfosApi, getRecruitersListApi} from "../../../../../api/pages/company.js"
import {COMMON,RECRUITER} from "../../../../../config.js"

let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
  },
  init() {
    let id = app.globalData.recruiterDetails.companyInfo.id
    let info = this.data.info
    getCompanyInfosApi({id}).then(res => {
      app.globalData.companyInfo = res.data
      getRecruitersListApi({id}).then(res0 => {
        app.globalData.companyInfo.recruiterList = res0.data
        this.setData({info: res.data})
      })
    })
  },
  jumpPage(e) {
    switch(e.currentTarget.dataset.type) {
      case 'main':
        if (app.globalData.recruiterDetails.isCompanyAdmin) {
          wx.navigateTo({
            url: `${RECRUITER}company/homepageEdit/homepageEdit?companyId=${app.globalData.recruiterDetails.companyInfo.id}`
          })
        } else {
          wx.navigateTo({
            url: `${COMMON}homepage/homepage?companyId=${app.globalData.recruiterDetails.companyInfo.id}`
          })
        }
      break
      case 'peoples':
        wx.navigateTo({
          url: `${RECRUITER}company/recruiterList/recruiterList`
        })
      break
      case 'bright':
        wx.navigateTo({
          url: `${RECRUITER}company/teamLabel/teamLabel`
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