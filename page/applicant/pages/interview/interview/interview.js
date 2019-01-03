import { getApplyListApi, getInviteListApi, getScheduleListApi } from '../../../../../api/pages/interview.js'
const app = getApp()
let childTab = 'all'
let chooseTime = 123132123
let firstIndex = 0 //一级tab当前选中项
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
        showRedDot: true,
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
            showRedDot: true
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
    companyList: [
//    {
//      id: 1,
//      recruiterName: '文双',
//      certification: false,
//      recruiterPosition: '创始人、CEO',
//      companyName: '老虎科技',
//      positionNumber: 18,
//      status: 1
//    },
//    {
//      id: 2,
//      recruiterName: '文双',
//      certification: true,
//      recruiterPosition: '创始人、CEO',
//      companyName: '老虎科技',
//      positionNumber: 18,
//      status: 0
//    }
    ]
  },
  getResult(e) {
    console.log(e)
  },
  /* tab切换 0:申请记录，1：收到邀请,2：面试日程*/
  firstTab (index) {
    if (index !== undefined) {
      firstIndex = index
      childTab = 'all'
    }
    switch (firstIndex) {
      case 0:
        return getApplyListApi({tab: childTab})
        break;
      case 1:
        return getInviteListApi({tab: childTab})
        break;
      case 2:
        return getScheduleListApi({time: chooseTime})
        break;
    }
  },
  chooseParentTab(e) {
    this.firstTab(e.currentTarget.dataset.index).then(res => {
      console.log(res.data, 7777)
    })
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
  chooseChildTab(e) {
    console.log(e.currentTarget.dataset.mark)
    childTab = e.currentTarget.dataset.mark
    this.firstTab().then(res => {
      console.log(res.data, 666)
    })
    const params = e.currentTarget.dataset
    const tabLists = this.data.tabLists
    let tabChildIndex = null
    tabLists[this.data.tabParentIndex].children.map((field, index) => {
      tabChildIndex = params.index
      field.active = index === params.index ? true : false
    })
    this.setData({
      tabLists,
      tabChildIndex
    })
  },
  init () {
    this.firstTab().then(res => {
      this.setData({
        companyList: res.data
      })
      console.log(res.data, 7777)
    })
  },
  onShow () {
    this.init()
  }
})
