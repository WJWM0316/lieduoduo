import {getSelectorQuery} from "../../../../utils/util.js"
import {getOthersRecruiterDetailApi, giveMecallApi, putLabelFavorApi, removeLabelFavorApi} from "../../../../api/pages/recruiter.js"
import {getPositionListApi} from "../../../../api/pages/position.js"
import {getMyCollectUserApi, deleteMyCollectUserApi} from "../../../../api/pages/collect.js"
import {COMMON,RECRUITER,APPLICANT} from "../../../../config.js"
import {shareRecruiter} from '../../../../utils/shareWord.js'

let recruiterCard = ''
let app = getApp()
let positionTop = 0
let identity = ''
let isLock = 0
Page({
  data: {
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
      onBottomStatus: 0
    },
    pageCount: 20,
    isShowBtn: true,
    options: {},
    hasReFresh: false,
    isApplicant: false,
    cdnImagePath: app.globalData.cdnImagePath,
    showEdit: false,
    showRules: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    recruiterCard = ''
    if (options.scene) options = app.getSceneParams(options.scene)
    if (identity !== 'RECRUITER') {
      this.setData({isApplicant: true})
    }
    identity = app.identification(options)
    this.setData({options})
  },
  backEvent() {
    if(this.data.showEdit) {
      this.setData({showEdit: false})
    } else {
      wx.navigateBack({delta: 1})
    }
  },
  /* 点击查看大头像 */
  readAvatar () {
    wx.previewImage({
      current: this.data.info.avatar.url, // 当前显示图片的http链接
      urls: [this.data.info.avatar.url] // 需要预览的图片http链接列表
    })
  },
  reload() {
    this.getOthersInfo(false, true)
  },
  getOthersInfo(hasLoading = true, isReload = false) {
    return new Promise((resolve, reject) => {
      getOthersRecruiterDetailApi({uid: this.data.options.uid, hasLoading, isReload, ...app.getSource()}).then(res => {
        let isOwner = res.data.isOwner && identity === 'RECRUITER' ? true : false
        let info = res.data
        if(info.isBlockRecruiter === 1 || info.currentCompanyId === 0) {
          info.hasDeleted = 1
        } else {
          info.hasDeleted = 0
        }
        this.setData({isOwner, info, realIsOwner: res.data.isOwner}, function() {
          // this.getDomNodePosition()
          if (this.data.isOwner) {
            app.globalData.recruiterDetails = res.data
          }
          this.getPositionLists(false)
          resolve(res)
        })
      })
    })
  },
  getPositionLists(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let isOwner = this.data.isOwner
      let params = {recruiter: this.data.options.uid, count: this.data.pageCount, page: this.data.positionList.pageNum, hasLoading}
      if(isOwner) {
        params = Object.assign(params, {is_online: 1})
      }
      getPositionListApi(params).then(res => {
        let positionList = this.data.positionList
        positionList.onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        positionList.list = positionList.list.concat(res.data)
        positionList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        positionList.pageNum = positionList.pageNum + 1
        positionList.isRequire = true
        positionList.total = res.meta.total
        isLock = 0
        this.setData({positionList}, () => resolve(res))
      })
    })
  },
  onShow() {
    let options = this.data.options
    let positionList = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: false
    }
    isLock = 1
    this.setData({positionList})
    if (app.loginInit) {
      this.getOthersInfo()
      if (app.globalData.isRecruiter) {
        this.setData({isRecruiter: app.globalData.isRecruiter})
      } else {
        app.getRoleInit = () => {
          this.setData({isRecruiter: app.globalData.isRecruiter})
        }
      }
    } else {
      app.loginInit = () => {
        this.getOthersInfo()
        if (app.globalData.isRecruiter) {
          this.setData({isRecruiter: app.globalData.isRecruiter})
        } else {
          app.getRoleInit = () => {
            this.setData({isRecruiter: app.globalData.isRecruiter})
          }
        }
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
      url: `${COMMON}rank/rank`
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
      case 'toRank':
        url = `${COMMON}rank/rank`
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
    if (identity !== 'APPLICANT') {
      app.promptSwitch({
        source: identity
      })
      return
    }
    if (app.globalData.hasLogin && !app.globalData.isJobhunter) {
      let path = app.getCurrentPagePath()
      wx.navigateTo({url: `${APPLICANT}createUser/createUser?directChat=${encodeURIComponent(path)}&todoAction=collect&from=6`})
      return
    }
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
    wx.setStorageSync('choseType', 'RECRUITER')
    wx.navigateTo({
      url: `${RECRUITER}user/company/apply/apply`
    })
  },
  formSubmit(e) {
    app.postFormId(e.detail.formId)
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
    let positionList = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: false
    }
    this.setData({positionList})
    this.getOthersInfo(false, true).then(res => {
      this.setData({hasReFresh: false})
      wx.stopPullDownRefresh()
    }).catch(e => {
      wx.stopPullDownRefresh()
    })
  },
  getCreatedImg(e) {
    recruiterCard = e.detail
  },
  onShareAppMessage(options) {
    let that = this
    let info = this.data.info
    if(info.hasDeleted) {
      console.log('该招聘官异常', info)
      return app.wxShare({options})
    }
    app.shareStatistics({
      id: that.data.options.uid,
      type: 'recruiter',
      sCode: that.data.info.sCode,
      channel: 'card'
    })
　　return app.wxShare({
      options,
      title: shareRecruiter(),
      path: `${COMMON}recruiterDetail/recruiterDetail?uid=${this.data.options.uid}&sCode=${this.data.info.sCode}&sourceType=shr`,
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
    let positionList = this.data.positionList
    if (!positionList.isLastPage && !isLock ) {
      console.log('c')
      this.getPositionLists(false)
    }
  },
  tips() {

  },
  edit() {
    if(this.data.isOwner) this.setData({showEdit: true})
  },
  share() {
    this.selectComponent('#shareBtn').oper()
  },
  getCreatedImg(e) {
    recruiterCard = e.detail
  },
  toggleShowRules() {
    this.setData({showRules: !this.data.showRules})
  },
  stopPageScroll() {return false },

})