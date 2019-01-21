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
    cdnImagePath: app.globalData.cdnImagePath,
    browseMySelfLists: [], //看过我的
    mapyCollectUser: [], // 我收藏的求职者列表
    identity: 'RECRUITER',
    browseMySelf: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    },
    collectMySelf: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    },
    collectUsers: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    },
    pageCount: app.globalData.pageCount,
    hasReFresh: false,
    onBottomStatus: 0
  },
  onLoad() {
    getBrowseMySelfApi()
      .then(res => {
        this.setData({browseMySelfLists: res.data})
      })
    app.pageInit = () => {}
    this.getCollectMySelf()
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
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   看过我的列表
   * @return   {[type]}   [description]
   */
  getBrowseMySelf(hasLoading = true) {
    return new Promise((resolve, reject) => {
      const params = {count: this.data.pageCount, page: this.data.browseMySelf.pageNum, hasLoading}
      getBrowseMySelfApi(params)
        .then(res => {
          const browseMySelf = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
          browseMySelf.list = browseMySelf.list.concat(res.data)
          browseMySelf.isLastPage = res.meta.nextPageUrl ? false : true
          browseMySelf.pageNum = browseMySelf.pageNum + 1
          browseMySelf.isRequire = true
          const onBottomStatus = res.meta.nextPageUrl ? 0 : 2
          this.setData({browseMySelf, onBottomStatus})
          resolve(res)
        })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   收集过我的列表
   * @return   {[type]}   [description]
   */
  getCollectMySelf(hasLoading = true) {
    return new Promise((resolve, reject) => {
      const params = {count: this.data.pageCount, page: this.data.collectMySelf.pageNum, hasLoading}
      getCollectMySelfApi(params)
        .then(res => {
          const collectMySelf = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
          collectMySelf.list = collectMySelf.list.concat(res.data)
          collectMySelf.isLastPage = res.meta.nextPageUrl ? false : true
          collectMySelf.pageNum = collectMySelf.pageNum + 1
          collectMySelf.isRequire = true
          const onBottomStatus = res.meta.nextPageUrl ? 0 : 2
          this.setData({collectMySelf, onBottomStatus})
          resolve(res)
        })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   我感兴趣的列表
   * @return   {[type]}   [description]
   */
  getMyCollectUsers(hasLoading = true) {
    return new Promise((resolve, reject) => {
      const params = {count: this.data.pageCount, page: this.data.collectUsers.pageNum, hasLoading}
      getMyCollectUsersApi(params)
        .then(res => {
          const collectUsers = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
          collectUsers.list = collectUsers.list.concat(res.data)
          collectUsers.isLastPage = res.meta.nextPageUrl ? false : true
          collectUsers.pageNum = collectUsers.pageNum + 1
          collectUsers.isRequire = true
          const onBottomStatus = res.meta.nextPageUrl ? 0 : 2
          this.setData({collectUsers, onBottomStatus})
          resolve(res)
        })
    })
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
