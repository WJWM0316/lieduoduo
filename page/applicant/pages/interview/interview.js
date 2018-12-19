const app = getApp()
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
            id: 'pending',
            text: '待安排面试',
            active: false,
            showRedDot: true
          },
          {
            id: 'resolve',
            text: '已安排面试',
            active: false,
            showRedDot: false
          },
          {
            id: 'reject',
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
            id: 'pending',
            text: '待处理',
            active: false,
            showRedDot: false
          },
          {
            id: 'pending-v',
            text: '待安排面试',
            active: false,
            showRedDot: false
          },
          {
            id: 'resolve-v',
            text: '已安排面试',
            active: false,
            showRedDot: false
          },
          {
            id: 'reject',
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
        active: false,
        children: [
          {
            id: 'all',
            text: '全部',
            active: false,
            showRedDot: false
          },
          {
            id: 'pending',
            text: '待安排面试',
            active: false,
            showRedDot: false
          },
          {
            id: 'resolve',
            text: '已安排面试',
            active: false,
            showRedDot: false
          },
          {
            id: 'reject',
            text: '不合适',
            active: false,
            showRedDot: false
          }
        ]
      }
    ],
    companyList: [
      {
        id: 1,
        recruiterName: '文双',
        certification: false,
        recruiterPosition: '创始人、CEO',
        companyName: '老虎科技',
        positionNumber: 18,
        status: 1
      },
      {
        id: 2,
        recruiterName: '文双',
        certification: true,
        recruiterPosition: '创始人、CEO',
        companyName: '老虎科技',
        positionNumber: 18,
        status: 0
      }
    ]
  },
  getResult(e) {
    console.log(e)
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
  chooseChildTab(e) {
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
  }
})
