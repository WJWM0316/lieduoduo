import {RECRUITER} from '../../../../../config.js'
import { getInviteListApi, getApplyListApi, getScheduleListApi } from '../../../../../api/pages/interview.js'
const app = getApp()
let param = {
  tab : 'all',
  firstIndex : 0 //一级tab当前选中项
}
Page({
  data: {
    tabParentIndex: 0,
    tabChildIndex: 0,
    identity: '',
    companyList: [],
    tabLists: [
      {
        id: 'apply',
        text: '收到意向',
        showRedDot: true,
        active: true,
        statusIndex: 0,
        officeIndex: 0,
        statusList: [
          '所有状态', '所有状态1', '所有状态2', '所有状态3'
        ],
        officeLists: [
          '前端开发', '后端开发', '产品运营', '设计大咖'
        ]
      },
      {
        id: 'receive',
        text: '我的邀请',
        showRedDot: false,
        active: false,
        statusIndex: 0,
        officeIndex: 0,
        statusList: [
          '所有状态', '所有状态1', '所有状态2', '所有状态3'
        ],
        officeLists: [
          '前端开发', '后端开发', '产品运营', '设计大咖'
        ]
      },
      {
        id: 'interview',
        text: '面试日程',
        showRedDot: false,
        active: false,
        statusIndex: 0,
        officeIndex: 0,
        statusList: [
          '所有状态', '所有状态1', '所有状态2', '所有状态3'
        ],
        officeLists: [
          '前端开发', '后端开发', '产品运营', '设计大咖'
        ]
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
  chooseParentTab(e) {
    const params = e.currentTarget.dataset
    const tabLists = this.data.tabLists
    let tabParentIndex = null
    tabLists.map((field, index) => {
      tabParentIndex = params.index
      field.active = index === params.index ? true : false
    })
    this.setData({
      tabLists,
      tabParentIndex
    })
  },
  bindChange(e) {
    console.log(e.currentTarget.dataset)
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
  chooseParentTab(e) {
    console.log(e.currentTarget.dataset.index)
    const params = e.currentTarget.dataset
    const tabLists = this.data.tabLists
    let tabParentIndex = null
    tabLists.map((field, index) => {
      tabParentIndex = params.index
      field.active = index === params.index ? true : false
    })
    this.firstTab(e.currentTarget.dataset.index).then(res => {
      this.setData({
        companyList: res.data,
        tabLists,
        tabParentIndex
      })
    })
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
    this.firstTab().then(res => {
      this.setData({
        companyList: res.data
      })
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
