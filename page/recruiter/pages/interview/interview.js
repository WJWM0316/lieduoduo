const app = getApp()

Page({
  data: {
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
  }
})
