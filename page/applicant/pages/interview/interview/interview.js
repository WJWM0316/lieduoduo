import { getApplyListApi, getInviteListApi, getScheduleListApi, getRedDotListApi } from '../../../../../api/pages/interview.js'
import {RECRUITER} from '../../../../../config.js'
const app = getApp()
let param = {
  page : 1,
  count : 20 //一级tab当前选中项
}
let tab = 'all'
let firstIndex = 0 //一级tab当前选中项0:申请列表 1：邀请列表 2：时间列表
Page({
  data: {
    cdnImagePath: app.globalData.cdnImagePath,
    tabParentIndex: 0,
    tabChildIndex: null,
    dateList: ['2018年12月17日', '2018年12月16日', '2018年12月30日'],
    tabLists: [
      {
        id: 'apply',
        text: '申请记录',
        showRedDot: false,
        active: true,
        children: [
          {
            id: 'all',
            text: '全部',
            active: true,
            showRedDot: false
          },
          {
            id: 'waiting_arrangement',
            text: '待安排面试',
            active: false,
            showRedDot: false
          },
          {
            id: 'have_arrangement',
            text: '已安排面试',
            active: false,
            showRedDot: false
          },
          {
            id: 'not_suitable',
            text: '不合适',
            active: false,
            showRedDot: false
          }
        ]
      },
      {
        id: 'receive',
        text: '收到邀请',
        showRedDot: false,
        active: false,
        children: [
          {
            id: 'all',
            text: '全部',
            active: true,
            showRedDot: false
          },
          {
            id: 'waiting_processing',
            text: '待处理',
            active: false,
            showRedDot: false
          },
          {
            id: 'waiting_arrangement',
            text: '待安排面试',
            active: false,
            showRedDot: false
          },
          {
            id: 'have_arrangement',
            text: '已安排面试',
            active: false,
            showRedDot: false
          },
          {
            id: 'not_suitable',
            text: '不合适',
            active: false,
            showRedDot: false
          }
        ]
      },
      {
        id: 'interview',
        text: '面试日程',
        showRedDot: false,
        active: false
      }
    ],
    companyList: []
  },
  /* 面试日程 */
  getResult(e) {
    param.time = e.detail.timeStamp
    delete param.tab
    this.firstTab().then(res => {
      companyList: res.data
    })
  },
  /* tab切换 0:申请记录，1：收到邀请,2：面试日程*/
  firstTab (index) {
    if (index !== undefined) {
      firstIndex = index
    }
    switch (firstIndex) {
      case 0:
        param.tab = tab
        return getApplyListApi(param)
        break;
      case 1:
        param.tab = tab
        return getInviteListApi(param)
        break;
      case 2:
        return getScheduleListApi(param)
        break;
    }
  },
  chooseParentTab(e) {
    const params = e.currentTarget.dataset
    const tabLists = this.data.tabLists
    let tabParentIndex = null
    tabLists.map((field, index) => {
      tabParentIndex = params.index
      field.active = index === params.index ? true : false
      if (index === params.index) {
        if (field.children) {
          for (let key in field.children) {
            if (field.children[key].active) {
              tab = field.children[key].id
              
            }
          }
        }
      }
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
    tab = e.currentTarget.dataset.mark
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
    getRedDotListApi().then(res => {
      console.log(res)
    })
  },
  onLoad () {},
  onShow () {
    this.init()
  },
  toHistory () {}
})
