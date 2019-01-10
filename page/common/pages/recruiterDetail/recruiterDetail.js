import {getSelectorQuery} from "../../../../utils/util.js"
import {getOthersRecruiterDetailApi, getRecruiterDetailApi, giveMecallApi, putLabelFavorApi} from "../../../../api/pages/recruiter.js"
import {getPositionListApi} from "../../../../api/pages/position.js"
import {getMyCollectUserApi, deleteMyCollectUserApi} from "../../../../api/pages/collect.js"
import {COMMON,RECRUITER,APPLICANT} from "../../../../config.js"

let app = getApp()
let positionTop = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPage: false,
    isShrink: false,
    btnTxt: '展开内容',
    info: {},
    isOwner: false,
    isRecruiter: false,
    positionList: [],
    isShowBtn: true,
    options: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({options})
  },
  getOthersInfo() {
    getOthersRecruiterDetailApi({uid: this.data.options.uid}).then(res => {
      this.setData({info: res.data}, function() {
        getSelectorQuery('.msg').then(res => {
          if (res.height > 143) {
            this.setData({isShrink: true})
          }
        })
      })
    })
    getPositionListApi({recruiter: this.data.options.uid}).then(res => {
      this.setData({positionList: res.data}, function() {
        getSelectorQuery(".mainContent .position").then(res => {
          positionTop = res.top - res.height
        })
      })
    })
  },
  onShow: function () {
    let options = this.data.options
    if (app.globalData.isRecruiter) {
      this.setData({isRecruiter: app.globalData.isRecruiter})
    } else {
      app.getRoleInit = () => {
        this.setData({isRecruiter: app.globalData.isRecruiter})
      }
    }
    let myInfo = {}
    if (app.globalData.identity === "APPLICANT") {
      myInfo = app.globalData.resumeInfo
    } else {
      myInfo = app.globalData.recruiterDetails
    }
    if (myInfo.uid) {
      if (myInfo.uid === parseInt(options.uid)) {
        if (app.globalData.identity === "APPLICANT") {
          this.getOthersInfo()
        } else {
          this.setData({info: myInfo, isOwner: true})
        }
        this.setData({info: myInfo, isOwner: true})
      } else {
        this.getOthersInfo()
      }
    } else {
      app.pageInit = () => {
        if (app.globalData.identity === "APPLICANT") {
          myInfo = app.globalData.resumeInfo
        } else {
          myInfo = app.globalData.recruiterDetails
        }
        if (myInfo.uid === parseInt(options.uid)) {
          this.setData({info: myInfo, isOwner: true})
        } else {
          this.getOthersInfo()
        }
      }
    }
  },
  editJump(e) {
    let url = ''
    switch(e.currentTarget.dataset.type) {
      case 'labels':
        url = `${COMMON}tabsPage/tabsPage`
        break
      case 'profile':
        url = `${RECRUITER}user/editBrief/editBrief`
        break
      case 'declaration':
        let item = e.currentTarget.dataset.item
        wx.setStorageSync('choseTopicData', item)
        url = `${RECRUITER}user/editDeclaration/editDeclaration`
        break
      case 'addDeclaration':
        url = `${RECRUITER}user/chooseTopic/chooseTopic`
        break
    }
    wx.navigateTo({
      url: url
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  toggle() {
    let isShrink = this.data.isShrink
    let btnTxt = ''
    isShrink = !isShrink
    if (!isShrink) {
      btnTxt = '收起内容'
    } else {
      btnTxt = '展开内容'
    }
    this.setData({isShrink, btnTxt})
  },
  callBtn() {
    giveMecallApi({vkey: this.data.info.vkey}).then(res => {})
  },
  favor(e) {
    console.log()
    let data = {
      recruiterLabelId: e.currentTarget.dataset.id
    }
    putLabelFavorApi(data).then(res => {})
  },
  collect() {
    let data = {
      uid: this.data.options.uid
    }
    if (!this.data.info.interested) {
      getMyCollectUserApi(data).then(res => {
        app.wxToast({
          title: '收藏成功',
          icon: 'success'
        })
        let info = this.data.info
        info.interested = true
        this.setData({info})
      })
    } else {
      deleteMyCollectUserApi(data).then(res => {
        app.wxToast({
          title: '取消收藏',
          icon: 'success'
        })
        let info = this.data.info
        info.interested = false
        this.setData({info})
      })
    }
  },
  jumpPage(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `${COMMON}positionDetail/positionDetail?positionId=${id}`
    })
  },
  scrollPs() {
    wx.pageScrollTo({
      scrollTop: positionTop
    })
  },
  create() {
    wx.navigateTo({
      url: `${COMMON}bindPhone/bindPhone`
    })
  },
  onPageScroll(e) { // 获取滚动条当前位置
    if (e.scrollTop >= positionTop) {
      if (!this.data.isShowBtn) return
      this.setData({isShowBtn: false})
    } else {
      if (this.data.isShowBtn) return
      this.setData({isShowBtn: true})
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