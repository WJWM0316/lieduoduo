// page/common/pages/resumeDetail/resumeDetail.js
import { getPersonalResumeApi } from '../../../../api/pages/center.js'

import { inviteInterviewApi } from '../../../../api/pages/interview.js'
import { getMyCollectUserApi, deleteMyCollectUserApi } from '../../../../api/pages/collect.js'
import {APPLICANT, COMMON} from '../../../../config.js'
import {shareResume} from '../../../../utils/shareWord.js'

let isPreview = false
const app = getApp()
let resumeInfo = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: null,
    isOwner: false,
    hasReFresh: false,
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
    if (isPreview) {
      isPreview = false
      return
    }
    this.init(this.data.options)
  },
  preview(e) {
    let list = []
    this.data.info.moreIntroduce.imgs.map((item) => {
      list.push(item.url)
    })
    wx.previewImage({
     current: e.currentTarget.dataset.current,
     urls: list,
     complete() {
      isPreview = true
     }
    })
  },
  init(options) {
    let identity = wx.getStorageSync('choseType')
    let myInfo = {}
    if (identity === "APPLICANT") {
      myInfo = app.globalData.resumeInfo
    } else {
      myInfo = app.globalData.recruiterDetails
    }
    if (myInfo.uid) {
      if (myInfo.uid === parseInt(options.uid) || !options.uid) {
        if (identity === "RECRUITER") {
          this.getOthersInfo()
        } else {
          this.setData({info: myInfo, isOwner: true, identity})
        }
      } else {
        this.getOthersInfo()
      }
    } else {
      app.pageInit = () => {
        if (identity === "APPLICANT") {
          myInfo = app.globalData.resumeInfo
        } else {
          myInfo = app.globalData.recruiterDetails
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
    return new Promise((resolve, reject) => {
      getPersonalResumeApi({uid: this.data.options.uid}).then(res => {
        this.setData({info: res.data})
        if (this.selectComponent('#interviewBar')) {
          this.selectComponent('#interviewBar').init()
        }
        resolve(res)
      })
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
  copy(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.copydata,
      success(res) {
        app.wxToast({
          title: '复制成功',
          icon: 'success'
        })
      }
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
  onPullDownRefresh(hasLoading = true) {
    this.setData({hasReFresh: true})
    if (!this.options.uid || parseInt(this.options.uid) === app.globalData.resumeInfo.uid) {
      getPersonalResumeApi().then(res => {
        app.globalData.resumeInfo = res.data
        wx.stopPullDownRefresh()
        this.setData({info: app.globalData.resumeInfo, hasReFresh: false})
      })
    } else {
      this.getOthersInfo().then(res => {
        this.setData({hasReFresh: false})
        wx.stopPullDownRefresh()
      })
    }
  },
  onShareAppMessage(options) {
    let that = this
　　return app.wxShare({
      options,
      title: shareResume(),
      path: `${COMMON}resumeDetail/resumeDetail?uid=${this.data.options.uid}`,
      imageUrl: `${that.data.cdnImagePath}shareC.png`
    })
  }
})