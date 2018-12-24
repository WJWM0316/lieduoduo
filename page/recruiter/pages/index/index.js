import {
  getMyBrowseUsersListApi,
  getMyBrowsePositionApi,
  getBrowseMySelfApi
} from '../../../../api/pages/browse.js'

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
      }
    ]
  },
  onShow() {
    getApp().globalData.identity = 'RECRUITER'
    getMyBrowsePositionApi()
  },
  changeCompanyLists(e) {
    let pageList = e.currentTarget.dataset.pageList
    this.setData({ pageList })
  }
})
