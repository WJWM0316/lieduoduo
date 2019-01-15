// page/common/pages/resumeDetail/resumeDetail.js
import { getPersonalResumeApi } from '../../../../api/pages/center.js'
import { inviteInterviewApi } from '../../../../api/pages/interview.js'
import { getMyCollectUserApi, deleteMyCollectUserApi } from '../../../../api/pages/collect.js'
let id = 92
const app = getApp()
let resumeInfo = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: null,
    isOwner: false,
    identity: '',
    cdnImagePath: app.globalData.cdnImagePath
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    id = options
    const { vkey } = options
//  this.init(options)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.init(id)
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
    getPersonalResumeApi(id).then(res => {
      this.setData({info: res.data})
      this.selectComponent('#interviewBar').init()
    })
  },
  /* 编辑 */
  edit (e) {
    let editName = e.currentTarget.dataset.editname
    let url = null
    switch (editName) {
      case 'info':
        url = '/page/applicant/pages/center/userInfoEdit/userInfoEdit'
        break;
      case 'intent':
        url = `/page/applicant/pages/center/resumeEditor/aimsEdit/aimsEdit?id=${e.currentTarget.dataset.id}`
        break;
      case 'work':
        url = `/page/applicant/pages/center/resumeEditor/workEdit/workEdit?id=${e.currentTarget.dataset.id}`
        break;
      case 'project':
        url = `/page/applicant/pages/center/resumeEditor/itemEdit/itemEdit?id=${e.currentTarget.dataset.id}`
        break;
      case 'education':
        url = `/page/applicant/pages/center/resumeEditor/educateEdit/educateEdit?id=${e.currentTarget.dataset.id}`
        break;
      case 'more':
        url = `/page/applicant/pages/center/resumeEditor/moreEdit/moreEdit?id=${e.currentTarget.dataset.id}`
        break;
    }
    wx.navigateTo({
      url: url
    })
  },
  /* 开撩 */
  toCommunicate () {
    inviteInterviewApi({jobhunterUid: id.uid, positionId: 110101})
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