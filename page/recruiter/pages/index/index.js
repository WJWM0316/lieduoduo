import { getMyBrowseUsersApi } from '../../../../api/pages/recruiter.js'

const app = getApp()

Page({
  data: {
    pageList: 'all',
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
        certification: false,
        recruiterPosition: '创始人、CEO',
        companyName: '老虎科技',
        positionNumber: 18,
        status: 1
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
      }
    ]
  },
  onShow() {
    getApp().globalData.identity = 'RECRUITER'
    getMyBrowseUsersApi()
  },
  changeCompanyLists(e) {
    let pageList = e.currentTarget.dataset.pageList
    this.setData({ pageList })
  }
})
