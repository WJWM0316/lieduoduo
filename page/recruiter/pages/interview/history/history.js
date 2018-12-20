const app = getApp()

Page({
  data: {
    cityLabel: ['广州', '深圳', '上海', '北京', '杭州', '重庆', '合肥'],
    listStatus: [
      {
        id: 'all',
        active: true,
        text: '全部'
      },
      {
        id: 'opening',
        active: false,
        text: '开放中'
      },
      {
        id: 'pending',
        active: false,
        text: '审核中'
      },
      {
        id: 'fail',
        active: false,
        text: '审核失败'
      },
      {
        id: 'closed',
        active: false,
        text: '已关闭'
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
      },
      {
        id: 9,
        recruiterName: '文双',
        certification: true,
        recruiterPosition: '创始人、CEO',
        companyName: '老虎科技',
        positionNumber: 18,
        status: 0
      },
      {
        id: 10,
        recruiterName: '文双',
        certification: true,
        recruiterPosition: '创始人、CEO',
        companyName: '老虎科技',
        positionNumber: 18,
        status: 0
      }
    ]
  },
  routeJump(e) {
    let companyId = e.currentTarget.dataset.companyId
    console.log(companyId)
  },
  /* 子级tab栏切换 */
  onClickTab(e) {
    let params = e.currentTarget.dataset
    const listStatus = this.data.listStatus
    listStatus.map((field, index) => field.active = index === params.index ? true : false)
    this.setData({listStatus})
  }
})
