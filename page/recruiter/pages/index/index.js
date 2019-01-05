import {
  getMyBrowseUsersListApi,
  getMyBrowsePositionApi,
  getBrowseMySelfApi,
  getCollectMySelfApi,
  getMyCollectUsersApi
} from '../../../../api/pages/browse.js'

import {
  getBrowseMySelfListsApi
} from '../../../../api/pages/recruiter.js'
const app = getApp()

Page({
  data: {
    pageList: 'seen-me',
    companyList: [],
    collectMyList: [],
    browseMySelfLists: [], //看过我的
    mapyCollectUser: [], // 我收藏的求职者列表
    identity: 'RECRUITER'
  },
  onLoad() {
    getBrowseMySelfApi()
      .then(res => {
        wx.setStorageSync('choseType', 'RECRUITER')
        this.setData({browseMySelfLists: res.data})
        console.log(res.data)
      })
    app.pageInit = () => {
      wx.setStorageSync('choseType', 'RECRUITER')
    }
  },
  toggle (tabName) {
    switch (tabName) {
      case 'seen-me':
        return getBrowseMySelfApi()
        break;
      case 'interested-me':
        return getCollectMySelfApi()
        break;
      case 'my-loved':
        return getMyCollectUsersApi()
        break;
    }
  },
  changeCompanyLists(e) {
    let pageList = e.currentTarget.dataset.pageList
    this.setData({ pageList })
    this.toggle(pageList).then(res => {
      if (pageList === "seen-me") {
        this.setData({browseMySelfLists: res.data})
      } else if (pageList === "interested-me") {
        this.setData({collectMyList: res.data})
      } else {
        this.setData({mapyCollectUser: res.data})
      }
    })
  }
})
