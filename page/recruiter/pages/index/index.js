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

import {RECRUITER, COMMON, APPLICANT} from '../../../../config.js'

import {getSelectorQuery}  from '../../../../utils/util.js'

import { getPositionListNumApi } from '../../../../api/pages/position.js'

const app = getApp()
let fixedDomPosition = 0
Page({
  data: {
    pageList: 'browseMySelf',
    cdnImagePath: app.globalData.cdnImagePath,
    navH: app.globalData.navHeight,
    choseType: '',
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
    pageCount: 10,
    background: 'transparent',
    hasReFresh: false,
    onBottomStatus: 0,
    isFixed: true,
    fixedDom: false
  },
  onLoad() {
    let choseType = wx.getStorageSync('choseType') || ''
    this.setData({choseType})
    if (choseType === 'APPLICANT') {
      app.wxConfirm({
        title: '提示',
        content: '检测到你是求职者，是否切换求职者',
        confirmBack() {
          wx.reLaunch({
            url: `${APPLICANT}index/index`
          })
        },
        cancelBack() {
          wx.setStorageSync('choseType', 'RECRUITER')
          app.getAllInfo()
        }
      })
    }
  },
  onShow() {
    const browseMySelf = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    }
    const collectMySelf = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    }
    const collectUsers = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    }
    let that = this
    this.setData({browseMySelf, collectUsers, collectMySelf})
    if (app.loginInit) {
      that.getLists().then(() => that.getDomNodePosition())
    } else {
      app.loginInit = () => {
        that.getLists().then(() => that.getDomNodePosition())
      }
    }
  },
  getDomNodePosition() {
    getSelectorQuery('.index-list-box').then(res => {
      fixedDomPosition = res.top - this.data.navH
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   获取列表数据
   * @return   {[type]}   [description]
   */
  getLists() {
    switch(this.data.pageList) {
      case 'browseMySelf':
        return this.getBrowseMySelf()
        break;
      case 'collectMySelf':
        return this.getCollectMySelf()
        break;
      case 'collectUsers':
        return this.getMyCollectUsers()
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
      const params = {count: this.data.pageCount, page: this.data.browseMySelf.pageNum, ...app.getSource()}
      getBrowseMySelfApi(params, hasLoading)
        .then(res => {
          const browseMySelf = this.data.browseMySelf
          const onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
          browseMySelf.list = browseMySelf.list.concat(res.data)
          browseMySelf.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
          browseMySelf.pageNum = browseMySelf.pageNum + 1
          browseMySelf.isRequire = true
          this.setData({browseMySelf, onBottomStatus}, () => resolve(res))
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
      const params = {count: this.data.pageCount, page: this.data.collectMySelf.pageNum, ...app.getSource()}
      getCollectMySelfApi(params, hasLoading)
        .then(res => {
          const collectMySelf = this.data.collectMySelf
          const onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
          collectMySelf.list = collectMySelf.list.concat(res.data)
          collectMySelf.isLastPage = res.meta.nextPageUrl ? false : true
          collectMySelf.pageNum = collectMySelf.pageNum + 1
          collectMySelf.isRequire = true
          this.setData({collectMySelf, onBottomStatus}, () => resolve(res))
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
      const params = {count: this.data.pageCount, page: this.data.collectUsers.pageNum, ...app.getSource()}
      getMyCollectUsersApi(params, hasLoading)
        .then(res => {
          const collectUsers = this.data.collectUsers
          const onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
          collectUsers.list = collectUsers.list.concat(res.data)
          collectUsers.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
          collectUsers.pageNum = collectUsers.pageNum + 1
          collectUsers.isRequire = true
          this.setData({collectUsers, onBottomStatus}, () => resolve(res))
        })
    })
  },
  ontabClick(e) {
    let pageList = e.currentTarget.dataset.key
    this.setData({pageList}, () => {
      const key = this.data.pageList
      if(!this.data[key].isRequire) this.getLists()
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   下拉重新获取数据
   * @return   {[type]}              [description]
   */
  onPullDownRefresh(hasLoading = true) {
    const key = this.data.pageList
    const value = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
    this.setData({[key]: value, hasReFresh: true})
    this.getLists()
        .then(res => {
          const value = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
          const onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
          value.list = res.data
          value.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
          value.pageNum = 2
          value.isRequire = true
          this.setData({[key]: value, onBottomStatus}, () => {
            wx.stopPullDownRefresh()
            this.setData({hasReFresh: false})
          })
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
    const key = this.data.pageList
    if (!this.data[key].isLastPage) {
      this.setData({onBottomStatus: 1})
      this.getLists(false)
    }
  },
  onShareAppMessage(options) {
    let that = this
　　return app.wxShare({options})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-23
   * @detail   就算页面的滚动
   * @return   {[type]}     [description]
   */
  onPageScroll(e) {
    if(e.scrollTop > this.data.navH - 5) {
      if (!this.data.isFixed) this.setData({isFixed: true, background: '#652791'})
    } else {
      if (this.data.isFixed) this.setData({isFixed: false, background: 'transparent'})
    }

    if(e.scrollTop > fixedDomPosition) {
      if (!this.data.fixedDom) this.setData({fixedDom: true})
    } else {
      if (this.data.fixedDom) this.setData({fixedDom: false})
    }
  },
  jump() {
    getPositionListNumApi().then(res => {
    })
  },
  formSubmit(e) {
    app.postFormId(e.detail.formId)
  },
  routeJump(e) {
    const params = e.currentTarget.dataset
    // 可能会存在空对象
    if(!Object.keys(params).length) return;
    // console.log(params)
    wx.navigateTo({url: `/page/common/pages/resumeDetail/resumeDetail?uid=${params.jobhunteruid}`})
  }
})
