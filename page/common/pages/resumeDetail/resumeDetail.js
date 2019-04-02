// page/common/pages/resumeDetail/resumeDetail.js
import { getOtherResumeApi } from '../../../../api/pages/center.js'
import { inviteInterviewApi } from '../../../../api/pages/interview.js'
import {getSelectorQuery} from "../../../../utils/util.js"
import { getMyCollectUserApi, deleteMyCollectUserApi } from '../../../../api/pages/collect.js'
import {APPLICANT, COMMON, RECRUITER} from '../../../../config.js'
import {shareResume} from '../../../../utils/shareWord.js'
let isPreview = false
const app = getApp()
let resumeInfo = null
let identity = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: null,
    isOwner: false,
    realIsOwner: false,
    hasReFresh: false,
    options: {},
    showLimit: 3,
    cdnImagePath: app.globalData.cdnImagePath
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.scene) options = app.getSceneParams(options.scene)
    identity = app.identification(options)
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
    if (app.loginInit) {
      this.getOthersInfo()
    } else {
      app.loginInit = () => {
        this.getOthersInfo()
      }
    }
  },
  openMoreCareer() {
    let showLimit = this.data.showLimit
    showLimit === 3 ? showLimit = 100 : showLimit = 3
    this.setData({showLimit})
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
  /* 点击查看大头像 */
  readAvatar () {
    wx.previewImage({
      current: this.data.info.avatar.url, // 当前显示图片的http链接
      urls: [this.data.info.avatar.url] // 需要预览的图片http链接列表
    })
  },
  getOthersInfo(hasLoading = true, isReload = false) {
    return new Promise((resolve, reject) => {
      getOtherResumeApi({uid: this.data.options.uid, hasLoading, isReload, ...app.getSource()}).then(res => {
        this.setData({info: res.data, isOwner: res.data.isOwner && identity === 'APPLICANT', realIsOwner: res.data.isOwner}, function() {
          if (this.data.isOwner) {
            app.globalData.resumeInfo = res.data
          }
          if (this.selectComponent('#interviewBar')) {
            this.selectComponent('#interviewBar').init()
          }
          resolve(res)
        })
        
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
  previewFile(e) {
    isPreview = true
    app.previewResume(e)
  },
  /* 收藏 */
  collect() {
    let data = {
      uid: this.data.options.uid
    }
    if (!this.data.info.interested) {
      getMyCollectUserApi(data).then(res => {
        app.wxToast({
          title: '已标记感兴趣',
          icon: 'success'
        })
        let info = this.data.info
        info.interested = true
        this.setData({info})
      })
    } else {
      deleteMyCollectUserApi(data).then(res => {
        app.wxToast({
          title: '取消标记感兴趣',
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
    this.getOthersInfo(false, true).then(res => {
      this.setData({hasReFresh: false})
      wx.stopPullDownRefresh()
    }).catch(e => {
      wx.stopPullDownRefresh()
    })
  },
  onShareAppMessage(options) {
    app.shareStatistics({
      id: that.data.options.uid,
      type: 'jobhunter',
      sCode: that.data.info.sCode,
      channel: 'card'
    })
　　return app.wxShare({
      options,
      title: shareResume(),
      path: `${COMMON}resumeDetail/resumeDetail?uid=${this.data.options.uid}&sCode=${this.data.info.sCode}&sourceType=shj`,
      imageUrl: `${that.data.cdnImagePath}shareB.png`
    })
  }
})