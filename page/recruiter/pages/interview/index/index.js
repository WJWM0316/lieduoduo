import {RECRUITER} from '../../../../../config.js'
import { getInviteListApi, getApplyListApi, getScheduleListApi } from '../../../../../api/pages/interview.js'
import {getPositionListApi} from '../../../../../api/pages/position.js'
const app = getApp()
let chooseTime = 0
Page({
  data: {
    info: {},
    tabIndex: 0,
    identity: '',
    applyData: {
      list: [],
      pageNum: 1,
      count: 5,
      isLastPage: false,
      isRequire: false
    },
    receiveData: {
      list: [],
      pageNum: 1,
      count: 5,
      isLastPage: false,
      isRequire: false
    },
    interviewData: {
      list: [],
      pageNum: 1,
      count: 5,
      isLastPage: false,
      isRequire: false
    },
    applyIndex: 0,
    receiveIndex: 0,
    positionIndex: 0,
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
  changeCompanyLists(e) {
    let pageList = e.currentTarget.dataset.pageList
    this.setData({ pageList })
  },
  bindChange(e) {
    const params = e.currentTarget.dataset
    const tabChildIndex = e.detail.value
    const tabLists = this.data.tabLists
    switch(params.type) {
      case 'status':
        tabLists[this.data.tabParentIndex].statusIndex = parseInt(e.detail.value)
        break
      case 'office':
        tabLists[this.data.tabParentIndex].officeIndex = parseInt(e.detail.value)
        break
      default:
        break
    }
    this.setData({tabLists})
  },
  getResult(e) {
    chooseTime = e.detail.timeStamp    
  },
  /* tab切换 0:我的邀请，1：收到意向,2：面试日程*/
  firstTab (index) {
    if (index !== undefined) {
      param.firstIndex = index
      param.tab = 'all'
    }
    switch (param.firstIndex) {
      case 0:
        return getInviteListApi(param)
        break;
      case 1:
        return getApplyListApi(param)
        break;
      case 2:
        return getScheduleListApi(param)
        break;
    }
  },
  getApplyList() {
    let data = this.data.applyData
    let status = this.data.applyScreen[this.data.applyIndex].value
    let positionId = this.data.positionList[this.data.positionIndex]
    return getApplyListApi({count: data.count, page: data.pageNum, status, positionId}).then(res => {
    })
  },
  getInviteList() {
    let data = this.data.receiveData
    let status = this.data.receiveScreen[this.data.applyIndex].value
    let positionId = this.data.positionList[this.data.positionIndex]
    return getInviteListApi({count: data.count, page: data.pageNum, status, positionId}).then(res => {
    })
  },
  getScheduleList() {
    let data = this.data.interviewData
    let time = this.data.chooseTime
    return getScheduleListApi({count: data.count, page: data.pageNum, time}).then(res => {
    })
  }
  chooseParentTab(e) {
    let index = e.currentTarget.dataset.index
    let tabIndex = this.data.tabIndex
    if (tabIndex === index) return 
    let tabLists = this.data.tabLists
    tabLists[index].active = true
    tabLists[index].showRedDot = false
    switch(index) {
      case 0:
        let data =  this.data.applyData
        if (!data.isRequire) {
        }
    }
  },
  chooseChildTab(e) {
    param.tab = e.currentTarget.dataset.mark
    const params = e.currentTarget.dataset
    const tabLists = this.data.tabLists
    let tabChildIndex = null
    tabLists[this.data.tabParentIndex].children.map((field, index) => {
      tabChildIndex = params.index
      field.active = index === params.index ? true : false
    })
    this.firstTab().then(res => {
      this.setData({
        tabLists,
        tabChildIndex,
        companyList: res.data
      })
    })
  },
  init () {
    let id = app.globalData.recruiterDetails.uid
    getPositionListApi({recruiter: id, status: 1}).then(res => {
      let positionList = res.data
      positionList.push({positionName: '所有职位', id: 0})
      this.setData({positionList})
    })
  },
  onLoad () {
    this.init ()
  },
  onShow () {
//  console.log(wx.getStorageSync('choseType'), 999)
//  getInviteListApi().then(res => {
//    this.setData({
//      identity: wx.getStorageSync('choseType'),
//      companyList: res.data
//    })
//  })
  }
})
