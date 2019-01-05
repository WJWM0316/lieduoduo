import {
  getMyBrowseUsersListApi,
  getMyBrowsePositionApi,
  getBrowseMySelfApi
} from '../../../../api/pages/browse.js'

import {
  getBrowseMySelfListsApi
} from '../../../../api/pages/recruiter.js'

const app = getApp()

Page({
  data: {
    pageList: 'seen-me',
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
    ],
    browseMySelfLists: []
  },
  onLoad() {
    app.pageInit = () => {
      getBrowseMySelfListsApi()
        .then(res => {
          this.setData({browseMySelfLists: res.data})
          console.log(res.data)
        })
    }
  },
  changeCompanyLists(e) {
    let pageList = e.currentTarget.dataset.pageList
    this.setData({ pageList })
  }
})
