import {getSelectorQuery} from "../../../../utils/util.js"
import {getOthersRecruiterDetailApi, getRecruiterDetailApi, giveMecallApi, putLabelFavorApi, removeLabelFavorApi} from "../../../../api/pages/recruiter.js"
import {getPositionListApi} from "../../../../api/pages/position.js"
import {getMyCollectUserApi, deleteMyCollectUserApi} from "../../../../api/pages/collect.js"
import {COMMON,RECRUITER,APPLICANT} from "../../../../config.js"
import {shareRecruiter} from '../../../../utils/shareWord.js'

let app = getApp()
let positionTop = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    identity: '',
    showPage: false,
    isShrink: false,
    needShrink: false,
    btnTxt: '展开内容',
    info: {},
    isOwner: false,
    isRecruiter: false,
    positionList: [],
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

    if (options.scene) {
      options = app.getSceneParams(options.scene)
    }
    let identity = wx.getStorageSync('choseType')

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
    return new Promise((resolve, reject) => {
      getOthersRecruiterDetailApi({uid: this.data.options.uid}).then(res => {
        this.setData({info: res.data, btnTxt: '展开内容', isOwner: res.data.isOwner}, function() {
          if(this.selectComponent('#interviewBar')) this.selectComponent('#interviewBar').init()
          resolve(res)
            getSelectorQuery('.msg').then(res => {
              if (!res) return
              if (res.height > 143) {
                this.setData({isShrink: true, needShrink: true})
              } else {
                this.setData({isShrink: false, needShrink: false})
              }
            })
          
        })
      })
      getPositionListApi({recruiter: this.data.options.uid}).then(res => {
        this.setData({positionList: res.data}, function() {
          // getSelectorQuery(".mainContent .position").then(res => {
          //   console.log(res, res.top - res.height)
          //   positionTop = res.top - res.height
          // })
        })
      })
    })
  },
  isShrink() {
    let info = this.data.info
    if (info.brief) {
      getSelectorQuery('.msg').then(res => {
        if (res.height > 143) {
          this.setData({isShrink: true, needShrink: true})
        }
      })
    } else {
      this.setData({isShrink: false, needShrink: false})
    }
  },
  onShow() {
    let options = this.data.options
    let identity = wx.getStorageSync('choseType')

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
      scrollTop: positionTop
    })
  },
  create() {
    wx.navigateTo({
      url: `${RECRUITER}user/company/apply/apply`
    })
  },
  onPageScroll(e) { // 获取滚动条当前位置
    // console.log(e.scrollTop >= positionTop, this.data.isShowBtn)
    // if (e.scrollTop >= positionTop) {
    //   if (!this.data.isShowBtn) return
    //   this.setData({isShowBtn: false})
    // } else {
    //   if (this.data.isShowBtn) return
    //   this.setData({isShowBtn: true})
    // }
  },
  onPullDownRefresh(hasLoading = true) {
    this.setData({hasReFresh: true})
    if (!this.options.uid || parseInt(this.options.uid) === app.globalData.resumeInfo.uid) {
      getRecruiterDetailApi().then(res => {
        app.globalData.recruiterDetails = res.data
        this.setData({info: app.globalData.recruiterDetails, hasReFresh: false})
        wx.stopPullDownRefresh()
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
      title: shareRecruiter,
      noImg: true,
      path: `${COMMON}recruiterDetail/recruiterDetail?uid=${this.data.options.uid}`
      // imageUrl: `${that.data.cdnImagePath}shareC.png`
    })
  }
})