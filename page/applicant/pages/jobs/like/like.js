import {
  getMyCollectPositionsApi,
  getMyCollectUsersApi,
  deleteMycollectPositionApi,
  deleteMyCollectUserApi
} from '../../../../../api/pages/collect.js'

import {RECRUITER, APPLICANT, COMMON} from '../../../../../config.js'

const app = getApp()

Page({
  data: {
    hasReFresh: false,
    onBottomStatus: 0,
    tab: 'positionList',
    navH: app.globalData.navHeight,
    pageCount: 8,
    positionList: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    },
    recruiterList: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    }
  },
  onShow() {
    this.getLists()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-02-28
   * @detail   户取感兴趣列表
   * @return   {[type]}   [description]
   */
  getLists() {
    const api = this.data.tab === 'positionList' ? 'getCollectPositionsLists' : 'getCollectRecruiterListLists'
    return this[api]()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-02-28
   * @detail   获取收藏的职位列表
   * @return   {[type]}   [description]
   */
  getCollectPositionsLists(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let params = {count: this.data.pageCount, page: this.data.positionList.pageNum, hasLoading}
      getMyCollectPositionsApi(params).then(res => {
        const positionList = this.data.positionList
        const onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        positionList.list = positionList.list.concat(res.data)
        positionList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        positionList.pageNum = positionList.pageNum + 1
        positionList.isRequire = true
        this.setData({positionList, onBottomStatus}, () => resolve(res))
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-02-28
   * @detail   获取收藏的招聘官列表
   * @return   {[type]}   [description]
   */
  getCollectRecruiterListLists(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let params = {count: this.data.pageCount, page: this.data.recruiterList.pageNum, hasLoading}
      getMyCollectUsersApi(params).then(res => {
        const recruiterList = this.data.recruiterList
        const onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        recruiterList.list = recruiterList.list.concat(res.data)
        recruiterList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        recruiterList.pageNum = recruiterList.pageNum + 1
        recruiterList.isRequire = true
        this.setData({recruiterList, onBottomStatus}, () => resolve(res))
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-02-28
   * @detail   删除职位
   * @return   {[type]}     [description]
   */
  deletePosition(e) {
    const params = e.currentTarget.dataset
    let positionList = this.data.positionList
    app.wxConfirm({
      title: '删除该记录',
      content: '确定删除该条收藏记录？',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确定',
      cancelColor: '#BCBCBC',
      confirmColor: '#652791',
      confirmBack: () => {
        const item = positionList.list.find((item, index, arr) => index === params.index)
        positionList.list.splice(params.index, 1)
        this.setData({positionList: {}})
        deleteMycollectPositionApi({id: item.id}).then(res => {
          this.setData({positionList}, () => app.wxToast({title: '删除成功'}))
        })
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-02-28
   * @detail   删除招聘官
   * @return   {[type]}     [description]
   */
  deleteRecruiter(e) {
    const params = e.currentTarget.dataset
    let recruiterList = this.data.recruiterList
    app.wxConfirm({
      title: '删除该记录',
      content: '确定删除该条收藏记录？',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确定',
      cancelColor: '#BCBCBC',
      confirmColor: '#652791',
      confirmBack: () => {
        const item = recruiterList.list.find((item, index, arr) => index === params.index)
        recruiterList.list.splice(params.index, 1)
        this.setData({recruiterList: {}})
        deleteMyCollectUserApi({uid: item.uid}).then(() => {
          this.setData({recruiterList}, () => app.wxToast({title: '删除成功'}))
        })
      }
    })
  },
  onClickTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({tab}, () => {
      if(!this.data[tab].isRequire) this.getLists(false)
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   下拉重新获取数据
   * @return   {[type]}              [description]
   */
  onPullDownRefresh(hasLoading = true) {
    const key = this.data.tab
    const value = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
    this.setData({[key]: value, hasReFresh: true})
    this.getLists().then(res => {
      const value = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
      const onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
      value.list = res.data
      value.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
      value.pageNum = 2
      value.isRequire = true
      this.setData({[key]: value, onBottomStatus, hasReFresh: false}, () => wx.stopPullDownRefresh())
    }).catch(e => {
      wx.stopPullDownRefresh()
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   触底加载数据
   * @return   {[type]}   [description]
   */
  onReachBottom() {
    const key = this.data.tab
    const value = this.data[key]
    if (!value.isLastPage) {
      this.setData({onBottomStatus: 1})
      this.getLists(false)
    }
  },
  jump() {
    if(this.data.tab === 'positionList') {
      wx.switchTab({url: `${APPLICANT}jobs/job/job`})
    } else {
      wx.navigateTo({url: `${APPLICANT}officerActive/more/more`})
    }
  }
})