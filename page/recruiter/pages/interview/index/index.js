import {RECRUITER} from '../../../../../config.js'
import { getInviteListApi, getApplyListApi, getScheduleListApi, getScheduleNumberApi} from '../../../../../api/pages/interview.js'
import {getRecruiterPositionListApi} from '../../../../../api/pages/position.js'
const app = getApp()
let chooseTime = parseInt(new Date().getTime() / 1000)
let positionList = []
let initData = {
  list: [],
  pageNum: 1,
  count: 20,
  isLastPage: false,
  isRequire: false
}
Page({
  data: {
    navH: app.globalData.navHeight,
    tabIndex: 0,
    hasReFresh: false,
    applyData: initData,
    receiveData: initData,
    interviewData: initData,
    dateList: [],
    applyIndex: 0,
    receiveIndex: 0,
    positionIndex: 0,
    applyBottomStatus: 0,
    receiveBottomStatus: 0,
    interviewBottomStatus: 0,
    applyScreen: [
      {key: '所有状态', value: 0},
      {key: '我邀请的', value: 12},
      {key: '待安排', value: 21},
      {key: '待对方确认', value: 31},
      {key: '待我修改', value: 32},
      {key: '对方暂不考虑', value: 54},
      {key: '不合适', value: 52}
    ],
    receiveScreen: [
      {key: '所有状态', value: 0},
      {key: '未处理', value: 11},
      {key: '待安排', value: 21},
      {key: '待对方确认', value: 31},
      {key: '待我修改', value: 32},
      {key: '不合适', value: 52}
    ],
    positionList: [],
    tabLists: [
      {
        text: '收到意向',
        active: true,
        showRedDot: false
      },
      {
        text: '我的邀请',
        active: false,
        showRedDot: false
      },
      {
        text: '面试日程',
        active: false,
        showRedDot: false
      }
    ]
  },
  // 查看面试历史
  jumpInterviewPage(e) {
    wx.navigateTo({
      url: `${RECRUITER}interview/history/history`
    })
  },
  bindChange(e) {
    let type = ''
    let value = 0
    switch(e.currentTarget.dataset.type) {
      case 'applyStatus':
        type = 'applyIndex'
        value = parseInt(e.detail.value)
        let applyData = initData
        this.setData({[type]: value, applyData})
        this.getApplyList()
        break
      case 'receiveStatus':
        type = 'receiveIndex'
        value = parseInt(e.detail.value)
        let receiveData = initData
        this.setData({[type]: value, receiveData}, function() {
          this.getInviteList()
        })
        break
      case 'position':
        type = 'positionIndex'
        value = parseInt(e.detail.value)
        let data = {}
        let dataValue = initData
        if (this.data.tabIndex === 1) {
          data = 'applyData'
          this.setData({[type]: value, [data]: dataValue}, function() {
            this.getApplyList()
          })
        } else if (this.data.tabIndex === 0) {
          data = 'receiveData'
          this.setData({[type]: value, [data]: dataValue}, function() {
            this.getInviteList()
          })
        }
        break
    }
  },
  getResult(e) {
    chooseTime = e.detail.timeStamp
    this.getScheduleList()
  },
  // 我的邀请
  getApplyList(hasLoading = true) {
    let applyData = this.data.applyData
    let status = this.data.applyScreen[this.data.applyIndex].value
    let positionId = this.data.positionList[this.data.positionIndex].id
    let applyBottomStatus = 0
    return getApplyListApi({count: applyData.count, page: applyData.pageNum, status, positionId, hasLoading}).then(res => {
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
    let status = this.data.receiveScreen[this.data.receiveIndex].value
    let positionId = this.data.positionList[this.data.positionIndex].id
    let receiveBottomStatus = 0
    return getInviteListApi({count: receiveData.count, page: receiveData.pageNum, status, positionId, hasLoading}).then(res => {
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
    return getScheduleListApi({count: interviewData.count, page: interviewData.pageNum, time: chooseTime, hasLoading}).then(res => {
      interviewData.list = res.data
      interviewData.isRequire = true
      if (!res.meta || !res.meta.nextPageUrl) {
        interviewData.isLastPage = true
        interviewBottomStatus = 2
      }
      this.setData({interviewData, interviewBottomStatus})
    })
  },
  chooseParentTab(e) {
    let index = e.currentTarget.dataset.index
    let tabIndex = this.data.tabIndex
    if (tabIndex === index) return
    let tabLists = this.data.tabLists
    tabLists.map((item, i) => {
      tabLists[i].active = false
    })
    tabLists[index].active = true
    tabLists[index].showRedDot = false
    tabIndex = index
    this.setData({tabLists, tabIndex})
    let data = {}
    switch(index) {
      case 0:
        data = this.data.receiveData
        if (!data.isRequire) {
          this.getInviteList()
        }
        break
      case 1:
        data = this.data.applyData
        if (!data.isRequire) {
          this.getApplyList()
        }
        break
      case 2:
        data = this.data.interviewData
        if (!data.isRequire) {
          this.selectComponent('#myCalendar').scrollLeft()
          this.getScheduleList()
          getScheduleNumberApi().then(res => {
            let dateList = res.data
            this.setData({dateList})
          })
        }
        break
    }
  },
  init () {
    let id = app.globalData.recruiterDetails.uid
    getRecruiterPositionListApi({status: 1}).then(res => {
      positionList = res.data
      positionList.unshift({positionName: '所有职位', id: 0})
      this.setData({positionList})
      this.getInviteList()
    })
  },
  onShow () {
    this.init()
  },
  onReachBottom(e) {
    switch(this.data.tabIndex) {
      case 0:
        let receiveData = this.data.receiveData
        if (!receiveData.isLastPage) {
          this.setData({receiveBottomStatus: 1})
          this.getInviteList(false)
        }
      break
      case 1:
        let applyData = this.data.applyData
        if (!applyData.isLastPage) {
          this.setData({applyBottomStatus: 1})
          this.getApplyList(false)
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
        let receiveData = initData
        this.setData({receiveData, receiveBottomStatus: 0, hasReFresh: true})
        this.getInviteList(false).then(res => {
          wx.stopPullDownRefresh()
          this.setData({hasReFresh: false})
        })
      break
      case 1:
        let applyData = initData
        this.setData({applyData, applyBottomStatus: 0, hasReFresh: true})
        this.getApplyList(false).then(res => {
          wx.stopPullDownRefresh()
          this.setData({hasReFresh: false})
        })
      break
      case 2:
        let interviewData = initData
        this.setData({interviewData, interviewBottomStatus: 0, hasReFresh: true})
        this.getScheduleList(false).then(res => {
          wx.stopPullDownRefresh()
          this.setData({hasReFresh: false})
        })
      break
    }
  },
  onShareAppMessage(options) {
    let that = this
　　return app.wxShare({options})
  }
})
