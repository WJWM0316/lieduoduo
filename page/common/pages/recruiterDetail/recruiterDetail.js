import {getSelectorQuery} from "../../../../utils/util.js"
import {getOthersRecruiterDetailApi, getRecruiterDetailApi, giveMecallApi, putLabelFavorApi, removeLabelFavorApi} from "../../../../api/pages/recruiter.js"
import {getPositionListApi} from "../../../../api/pages/position.js"
import {getMyCollectUserApi, deleteMyCollectUserApi} from "../../../../api/pages/collect.js"
import {COMMON,RECRUITER,APPLICANT} from "../../../../config.js"
import {shareRecruiter} from '../../../../utils/shareWord.js'

let recruiterCard = ''
let app = getApp()
let positionTop = 0
Page({
  data: {
    identity: '',
    showPage: false,
    info: {},
    isOwner: false,
    realIsOwner: false,
    isRecruiter: false,
    positionList: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      hasReFresh: false,
      onBottomStatus: 0,
    },
    pageCount: 20,
    isShowBtn: true,
    options: {},
    hasReFresh: false,
    isApplicant: false,
    cdnImagePath: app.globalData.cdnImagePath
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    recruiterCard = ''
    if (options.scene) {
      options = app.getSceneParams(options.scene)
    }
    let identity = wx.getStorageSync('choseType') || 'APPLICANT'

    if (identity !== 'RECRUITER') {
      this.setData({isApplicant: true})
    }

    this.setData({options, identity})
  },
  /* 点击查看大头像 */
  readAvatar () {
    wx.previewImage({
      current: this.data.info.avatar.url, // 当前显示图片的http链接
      urls: [this.data.info.avatar.url] // 需要预览的图片http链接列表
    })
  },
  getOthersInfo() {
    let identity = wx.getStorageSync('choseType')
    return new Promise((resolve, reject) => {
      getOthersRecruiterDetailApi({uid: this.data.options.uid}).then(res => {
        let isOwner = res.data.isOwner && identity === 'RECRUITER' ? true : false
        this.setData({info: res.data, isOwner, realIsOwner: res.data.isOwner}, function() {
          if(this.selectComponent('#interviewBar')) this.selectComponent('#interviewBar').init()
          // this.getDomNodePosition()
          if (this.data.isOwner) {
            app.globalData.recruiterDetails = res.data
          }
          resolve(res)
        })
      })
      this.getPositionLists()
    })
  },
  getPositionLists(hasLoading = true) {
    return new Promise((resolve, reject) => {
      const params = {recruiter: this.data.options.uid, count: this.data.pageCount, page: this.data.positionList.pageNum, hasLoading}
      getPositionListApi(params).then(res => {
        const positionList = this.data.positionList
        positionList.onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        positionList.list = positionList.list.concat(res.data)
        positionList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        positionList.pageNum = positionList.pageNum + 1
        positionList.isRequire = true
        positionList.total = res.meta.total
        this.setData({positionList}, () => resolve(res))
      })
    })
  },
  onShow() {
    let options = this.data.options
    let identity = wx.getStorageSync('choseType')
    const positionList = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: false
    }
    this.setData({positionList})
    if (app.globalData.isRecruiter) {
      this.setData({isRecruiter: app.globalData.isRecruiter})
    } else {
      app.getRoleInit = () => {
        this.setData({isRecruiter: app.globalData.isRecruiter})
      }
    }

    if (app.loginInit) {
      this.getOthersInfo()
    } else {
      app.loginInit = () => {
        this.getOthersInfo()
      }
    }
  },
  getDomNodePosition() {
    getSelectorQuery('.mainContent .position').then(res => {
      positionTop = res.top - res.height + app.globalData.navHeight - app.globalData.systemInfo.screenHeight
      if (res.top < app.globalData.systemInfo.screenHeight) {
        this.setData({isShowBtn: false})
      }
    })
  },
  jump() {
    wx.navigateTo({
      url: `${APPLICANT}officerActive/more/more`
    })
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
  onReady() {
  },
  callBtn() {
    let info = this.data.info
    giveMecallApi({vkey: this.data.info.vkey}).then(res => {
      info.isCall = true
      app.wxToast({
        title: '打call成功',
        icon: 'succes'
      })
      this.setData({info})
    })
  },
  favor(e) {
    let info = this.data.info
    let data = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.index
    if (!data.hasFavor) {
      putLabelFavorApi({recruiterLabelId: data.id}).then(res => {
        info.personalizedLabels[index].hasFavor = true
        info.personalizedLabels[index].favorCount++
        this.setData({info})
      })
    } else {
      removeLabelFavorApi({recruiterLabelId: data.id}).then(res => {
        info.personalizedLabels[index].hasFavor = false
        info.personalizedLabels[index].favorCount--
        this.setData({info})
      })
    }
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
      scrollTop: positionTop + 400
    })
  },
  create() {
    wx.navigateTo({
      url: `${RECRUITER}user/company/apply/apply`
    })
  },
  // onPageScroll(e) { // 获取滚动条当前位置
  //   console.log(e)
  //   if (e.scrollTop >= positionTop) {
  //     if (!this.data.isShowBtn) return
  //     this.setData({isShowBtn: false})
  //   } else {
  //     if (this.data.isShowBtn) return
  //     this.setData({isShowBtn: true})
  //   }
  // },
  onPullDownRefresh(hasLoading = true) {
    this.setData({hasReFresh: true})
    const positionList = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: false
    }
    this.setData({positionList})
    if (!this.options.uid || parseInt(this.options.uid) === app.globalData.resumeInfo.uid) {
      getRecruiterDetailApi().then(res => {
        app.globalData.recruiterDetails = res.data
        this.setData({info: app.globalData.recruiterDetails, hasReFresh: false})
        wx.stopPullDownRefresh()
      }).catch(e => {
        wx.stopPullDownRefresh()
      })
    } else {
      this.getOthersInfo().then(res => {
        this.setData({hasReFresh: false})
        wx.stopPullDownRefresh()
      }).catch(e => {
        wx.stopPullDownRefresh()
      })
    }
  },
  getCreatedImg(e) {
    recruiterCard = e.detail
  },
  onShareAppMessage(options) {
    let that = this
　　return app.wxShare({
      options,
      title: shareRecruiter(),
      path: `${COMMON}recruiterDetail/recruiterDetail?uid=${this.data.options.uid}`,
      imageUrl: recruiterCard
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   触底加载数据
   * @return   {[type]}   [description]
   */
  onReachBottom() {
    const positionList = this.data.positionList
    if (!positionList.isLastPage) {
      this.getPositionLists(false)
    }
  },
  tips() {
    console.log(11111)
  }
})