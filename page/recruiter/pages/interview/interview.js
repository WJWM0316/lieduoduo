const app = getApp()

Page({
  data: {
    pageList: 'all',
    statusList: [
      '所有状态', '状态1', '状态2', '状态3'
    ],
    index: 0,
    tabParentIndex: 0,
    tabChildIndex: 0,
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
      },
      {
        id: 3,
        recruiterName: '文双',
        certification: true,
        recruiterPosition: '创始人、CEO',
        companyName: '老虎科技',
        positionNumber: 18,
        status: 0
      },
      {
        id: 4,
        recruiterName: '文双',
        certification: true,
        recruiterPosition: '创始人、CEO',
        companyName: '老虎科技',
        positionNumber: 18,
        status: 0
      },
      {
        id: 5,
        recruiterName: '文双',
        certification: true,
        recruiterPosition: '创始人、CEO',
        companyName: '老虎科技',
        positionNumber: 18,
        status: 0
      },
      {
        id: 6,
        recruiterName: '文双',
        certification: true,
        recruiterPosition: '创始人、CEO',
        companyName: '老虎科技',
        positionNumber: 18,
        status: 0
      },
      {
        id: 7,
        recruiterName: '文双',
        certification: true,
        recruiterPosition: '创始人、CEO',
        companyName: '老虎科技',
        positionNumber: 18,
        status: 0
      },
      {
        id: 8,
        recruiterName: '文双',
        certification: true,
        recruiterPosition: '创始人、CEO',
        companyName: '老虎科技',
        positionNumber: 18,
        status: 0
      }
    ],
    tabLists: [
      {
        id: 'apply',
        text: '收到意向',
        showRedDot: true,
        active: true,
        statusList: [
          {
            id: 'all',
            text: '所有状态'
          },
          {
            id: 'all1',
            text: '所有状态1'
          },
          {
            id: 'all2',
            text: '所有状态2'
          },
          {
            id: 'all3',
            text: '所有状态3'
          },
          {
            id: 'all4',
            text: '所有状态4'
          }
        ]
      },
      {
        id: 'receive',
        text: '我的邀请',
        showRedDot: false,
        active: false,
        statusList: [
          {
            id: 'all',
            text: '所有状态'
          },
          {
            id: 'all1',
            text: '所有状态1'
          },
          {
            id: 'all2',
            text: '所有状态2'
          },
          {
            id: 'all3',
            text: '所有状态3'
          },
          {
            id: 'all4',
            text: '所有状态4'
          }
        ]
      },
      {
        id: 'interview',
        text: '面试日程',
        showRedDot: false,
        active: false,
        statusList: [
          {
            id: 'all',
            text: '所有状态'
          },
          {
            id: 'all1',
            text: '所有状态1'
          },
          {
            id: 'all2',
            text: '所有状态2'
          },
          {
            id: 'all3',
            text: '所有状态3'
          },
          {
            id: 'all4',
            text: '所有状态4'
          }
        ]
      }
    ]
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
    const params = e.currentTarget.dataset
    const value = e.detail.value
    console.log(params, value)
  }
})
