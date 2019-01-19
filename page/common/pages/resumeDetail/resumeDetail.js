// page/common/pages/resumeDetail/resumeDetail.js
import { getPersonalResumeApi } from '../../../../api/pages/center.js'
import { inviteInterviewApi } from '../../../../api/pages/interview.js'
import { getMyCollectUserApi, deleteMyCollectUserApi } from '../../../../api/pages/collect.js'
import {APPLICANT} from '../../../../config.js'
const app = getApp()
let resumeInfo = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: null,
    isOwner: false,
    options: {},
    identity: '',
    cdnImagePath: app.globalData.cdnImagePath
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({options})
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.init(this.data.options)
  },
  init(options) {
    let identity = wx.getStorageSync('choseType')
    let myInfo = {}
    if (app.globalData.identity === "APPLICANT") {
      myInfo = app.globalData.resumeInfo
    } else {
      this.getOthersInfo()
    }
    if (myInfo.uid) {
      if (myInfo.uid === parseInt(options.uid) || !options.uid) {
        this.setData({info: myInfo, isOwner: true, identity})
      } else {
        this.getOthersInfo()
      }
    } else {
      app.pageInit = () => {
        if (app.globalData.identity === "APPLICANT") {
          myInfo = app.globalData.resumeInfo
        }
        if (myInfo.uid === parseInt(options.uid)) {
          this.setData({info: myInfo, isOwner: true, identity})
        } else {
          this.getOthersInfo()
        }
      }
    }
  },
  getOthersInfo() {
    getPersonalResumeApi({uid: this.data.options.uid}).then(res => {
      this.setData({info: res.data})
      this.selectComponent('#interviewBar').init()
    })
  },
  /* 编辑 */
  edit (e) {
    let editName = e.currentTarget.dataset.editname
    let url = null
    let id = e.currentTarget.dataset.id
    switch (editName) {
      case 'info':
        url = `${APPLICANT}center/userInfoEdit/userInfoEdit`
        break;
      case 'intent':
        url = `${APPLICANT}center/resumeEditor/aimsEdit/aimsEdit?id=${id}`
        break;
      case 'work':
        url = `${APPLICANT}center/resumeEditor/workEdit/workEdit?id=${id}`
        break;
      case 'project':
        url = `${APPLICANT}center/resumeEditor/itemEdit/itemEdit?id=${id}`
        break;
      case 'education':
        url = `${APPLICANT}center/resumeEditor/educateEdit/educateEdit?id=${id}`
        break;
      case 'more':
        url = `${APPLICANT}center/resumeEditor/moreEdit/moreEdit?id=${id}`
        break;
    }
    wx.navigateTo({
      url: url
    })
  },
  /* 收藏 */
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
})