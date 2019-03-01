import {
  getApplyListApi,
  getInviteListApi,
  getScheduleListApi,
  getRedDotListApi,
  getScheduleNumberApi
} from '../../../../../api/pages/interview.js'

import {RECRUITER, COMMON, APPLICANT} from '../../../../../config.js'

import {getSelectorQuery} from "../../../../../utils/util.js"

const app = getApp()

let chooseTime = parseInt(new Date().getTime() / 1000)

let initData = {
  list: [],
  pageNum: 1,
  count: 20,
  isLastPage: false,
  isRequire: false
}

Page({
  data: {
    cdnImagePath: app.globalData.cdnImagePath,
    navH: app.globalData.navHeight,
    fixedBarHeight: 0,
    dateList: [],
    hasReFresh: false,
    tabIndex: 0,
    applyScreen: [
      {key: '全部', value: 'all', active: true, showRedDot: false},
      {key: '待安排面试', value: 'waiting_arrangement', active: false, showRedDot: false},
      {key: '已安排面试', value: 'have_arrangement', active: false, showRedDot: false},
      {key: '不合适', value: 'not_suitable'}
    ],
    receiveScreen: [
      {key: '全部', value: 'all', active: true, showRedDot: false},
      {key: '待处理', value: 'waiting_processing', active: false, showRedDot: false},
      {key: '待安排面试', value: 'waiting_arrangement', active: false, showRedDot: false},
      {key: '已安排面试', value: 'have_arrangement', active: false, showRedDot: false},
      {key: '不合适', value: 'not_suitable', active: false, showRedDot: false}
    ],
    tabLists: [
      {
        id: 'apply',
        text: '申请记录',
        showRedDot: false,
        active: true
      },
      {
        id: 'receive',
        text: '收到邀请',
        showRedDot: false,
        active: false
      },
      {
        id: 'interview',
        text: '面试日程',
        showRedDot: false,
        active: false
      }
    ],
    applyIndex: 0,
    receiveIndex: 0,
    applyBottomStatus: 0,
    receiveBottomStatus: 0,
    interviewBottomStatus: 0,
    applyData: initData,
    receiveData: initData,
    interviewData: initData
  },
  /* 面试日程 */
  getResult(e) {
    if(e && e.detail && e.detail.timeStamp) {
      chooseTime = e.detail.timeStamp
      this.getScheduleList()
    }
    this.getFixedDomNodePosition()
  },
  chooseParentTab(e) {
    const index = e.currentTarget.dataset.index
    const tabLists = this.data.tabLists
    let tabIndex = index
    tabLists.map((field, i) => {
      field.active = false
    })
    tabLists[tabIndex].active = true
    this.setData({tabLists, tabIndex})
    this.getFixedDomNodePosition()
    let data = {}
    switch(index) {
      case 0:
        data = this.data.applyData
        if (!data.isRequire) {
          this.getApplyList()
        }
        break
      case 1:
        data = this.data.receiveData
        if (!data.isRequire) {
          this.getInviteList()
        }
        break
      case 2:
        data = this.data.interviewData
        let interviewData = initData
        chooseTime = ''
        this.setData({interviewData})
        this.selectComponent('#myCalendar').scrollLeft()
        this.getScheduleList()
        getScheduleNumberApi().then(res => {
          let dateList = res.data
          this.setData({dateList})
        })
        break
    }
  },
  chooseItem(e) {
    let index = e.currentTarget.dataset.index
    let typeIndex = ''
    let type = ''
    let obj = {}
    switch(this.data.tabIndex) {
      case 0:
        typeIndex = 'applyIndex'
        obj = this.data.applyScreen
        type = 'applyScreen'
        obj.map((item, index) => {
          item.active = false
        })
        let applyData = initData
        obj[index].active = true
        this.setData({[type]: obj, [typeIndex]: index})
        this.getApplyList()
        break
      case 1:
        typeIndex = 'receiveIndex'
        type = 'receiveScreen'
        obj = this.data.receiveScreen
        obj.map((item, index) => {
          item.active = false
        })
        let receiveData = initData
        obj[index].active = true
        this.setData({[type]: obj, [typeIndex]: index})
        this.getInviteList()
      break
    }
  },
  // 我的邀请
  getApplyList(hasLoading = true) {
    let applyData = this.data.applyData
    let tab = this.data.applyScreen[this.data.applyIndex].value
    let applyBottomStatus = 0
    return getApplyListApi({count: applyData.count, page: applyData.pageNum, tab}, hasLoading).then(res => {
      applyData.list = res.data
      applyData.isRequire = true
      if (!res.meta || !res.meta.nextPageUrl) {
        applyData.isLastPage = true
        applyBottomStatus = 2
      }
      this.setData({applyData, applyBottomStatus})
    })
  },
  // 收到意向
  getInviteList(hasLoading = true) {
    let receiveData = this.data.receiveData
    let tab = this.data.receiveScreen[this.data.receiveIndex].value
    let receiveBottomStatus = 0
    return getInviteListApi({count: receiveData.count, page: receiveData.pageNum, tab}, hasLoading).then(res => {
      receiveData.list = res.data
      receiveData.isRequire = true
      if (!res.meta || !res.meta.nextPageUrl) {
        receiveData.isLastPage = true
        receiveBottomStatus = 2
      }
      this.setData({receiveData, receiveBottomStatus})
    })
  },
  // 面试日程
  getScheduleList(hasLoading = true) {
    let interviewData = this.data.interviewData
    let interviewBottomStatus = 0
    return getScheduleListApi({count: interviewData.count, page: interviewData.pageNum, time: chooseTime}, hasLoading).then(res => {
      interviewData.list = res.data
      interviewData.isRequire = true
      if (!res.meta || !res.meta.nextPageUrl) {
        interviewData.isLastPage = true
        interviewBottomStatus = 2
      }
      this.setData({interviewData, interviewBottomStatus})
    })
  },
  init () {
    if (app.globalData.isJobhunter) {
      this.getApplyList()
    }
  },
  onShow () {
    this.init()
    this.getFixedDomNodePosition()
  },
  getFixedDomNodePosition() {
    getSelectorQuery('.fixed-dom').then(res => {
      this.setData({fixedBarHeight: res.height})
    })
  },
  onReachBottom(e) {
    switch(this.data.tabIndex) {
      case 0:
        let applyData = this.data.applyData
        if (!applyData.isLastPage) {
          this.setData({applyBottomStatus: 1})
          this.getApplyList(false)
        }
      break
      case 1:
        let receiveData = this.data.receiveData
        if (!receiveData.isLastPage) {
          this.setData({receiveBottomStatus: 1})
          this.getInviteList(false)
        }
      break
      case 2:
        let interviewData = this.data.interviewData
        if (!interviewData.isLastPage) {
          this.setData({interviewBottomStatus: 1})
          this.getScheduleList(false)
        }
      break
    }
  },
  onPullDownRefresh () {
    switch(this.data.tabIndex) {
      case 0:
        let applyData = initData
        this.setData({applyData, applyBottomStatus: 0, hasReFresh: true})
        this.getApplyList(false).then(res => {
          wx.stopPullDownRefresh()
          this.setData({hasReFresh: false})
        }).catch(e => {
          wx.stopPullDownRefresh()
        })
      break
      case 1:
        let receiveData = initData
        this.setData({receiveData, receiveBottomStatus: 0, hasReFresh: true})
        this.getInviteList(false).then(res => {
          wx.stopPullDownRefresh()
          this.setData({hasReFresh: false})
        }).catch(e => {
          wx.stopPullDownRefresh()
        })
      break
      case 2:
        let interviewData = initData
        this.setData({interviewData, interviewBottomStatus: 0, hasReFresh: true})
        this.getScheduleList(false).then(res => {
          wx.stopPullDownRefresh()
          this.setData({hasReFresh: false})
        }).catch(e => {
          wx.stopPullDownRefresh()
        })
      break
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-03-01
   * @detail   detail
   */
  routeJump(e) {
    const params = e.currentTarget.dataset
    // 不知道什么情款  有时候拿不到数据
    if(!Object.keys(params).length) return
    switch(params.status) {
      case 51:
        if(Number(params.positionid)) {
          wx.navigateTo({url: `${COMMON}positionDetail/positionDetail?positionId=${params.positionid}`})
        } else {
          wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${params.recruiteruid}`})
        }
        break
      case 12:
        if(Number(params.positionid)) {
          wx.navigateTo({url: `${COMMON}positionDetail/positionDetail?positionId=${params.positionid}`})
        } else {
          wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${params.recruiteruid}`})
        }
        break
      case 11:
        if(Number(params.positionid)) {
          wx.navigateTo({url: `${COMMON}positionDetail/positionDetail?positionId=${params.positionid}`})
        } else {
          wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${params.recruiteruid}`})
        }
        break
      case 21:
        if(Number(params.positionid)) {
          wx.navigateTo({url: `${COMMON}positionDetail/positionDetail?positionId=${params.positionid}`})
        } else {
          wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${params.recruiteruid}`})
        }
        break
      case 54:
        if(Number(params.positionid)) {
          wx.navigateTo({url: `${COMMON}positionDetail/positionDetail?positionId=${params.positionid}`})
        } else {
          wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${params.recruiteruid}`})
        }
        break
      default:
        wx.navigateTo({url: `${COMMON}arrangement/arrangement?id=${params.itemId}`})
        break
    }
  },
  formSubmit(e) {
    app.postFormId(e.detail.formId)
  }
})
