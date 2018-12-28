import {
  getMyBrowseUsersListApi,
  getMyBrowsePositionApi,
  getBrowseMySelfApi
} from '../../../../api/pages/browse.js'

const app = getApp()

Page({
  data: {
    pageList: 'seen-me',
    choseType: wx.getStorageSync('choseType') || null,
    userInfo: null,
    needLogin: false,
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
  onLoad() {
    getApp().globalData.identity = 'RECRUITER'
    getApp().checkLogin().then(res => {
      this.setData({userInfo: res})
    })
  },
  changeCompanyLists(e) {
    let pageList = e.currentTarget.dataset.pageList
    this.setData({ pageList })
  }
})
