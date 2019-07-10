import {
  getMyBrowseUsersListApi,
  getMyBrowsePositionApi,
  getBrowseMySelfApi,
  getCollectMySelfApi
} from '../../../../api/pages/browse.js'

import {
  getBrowseMySelfListsApi,
  getIndexShowCountApi
} from '../../../../api/pages/recruiter.js'

import {
  clearReddotApi
} from '../../../../api/pages/common.js'

import {RECRUITER, COMMON, APPLICANT, WEBVIEW, VERSION} from '../../../../config.js'

import {getSelectorQuery}  from '../../../../utils/util.js'

import { getPositionListNumApi } from '../../../../api/pages/position.js'

let app = getApp()
Page({
  data: {
    hasReFresh: false,
    showRules: false,
    tab: 'interestList',
    navH: app.globalData.navHeight,
    cdnImagePath: app.globalData.cdnImagePath,
    pageCount: 20,
    options: {},
    isJobhunter: app.globalData.isJobhunter,
    model: {
      show: false,
      title: '',
      type: ''
    },
    interestList: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: 0
    },
    viewList: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: 0
    },
    positionChoose: '',
    statusChoose: '',
    mixChoose: {},
    statusLists: [
      {
        id:1,
        text: '全部'
      },
      {
        id:2,
        text: '未处理'
      },
      {
        id:3,
        text: '不感兴趣'
      },
      {
        id:4,
        text: '我邀请的'
      },
      {
        id:5,
        text: '待安排'
      },
      {
        id:6,
        text: '待对方确认'
      },
      {
        id:7,
        text: '待我修改'
      },
      {
        id:8,
        text: '待对方修改'
      },
      {
        id:9,
        text: '已安排'
      },
      {
        id:10,
        text: '已结束'
      },
      {
        id:11,
        text: '不合适'
      }
    ]
  },
  onShow() {
    this.getViewList()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   下拉重新获取数据
   * @return   {[type]}              [description]
   */
  onPullDownRefresh() {
    let viewList = {list: [], pageNum: 1, isLastPage: false, isRequire: false, onBottomStatus: 0}
    this.setData({viewList, hasReFresh: true})
    this.getViewList().then(res => {
      this.setData({hasReFresh: false})
      wx.stopPullDownRefresh()
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let key = this.data.tab
    this.setData({onBottomStatus: 1})
    if (!this.data[key].isLastPage) this.getViewList()
  },
  /**
   * @Author   小书包
   * @DateTime 查看求职者简历
   * @return   {[type]}     [description]
   */
  viewResumeDetail(e) {
    let params = e.currentTarget.dataset
    if(params.type === 'clearRedDot') {
      clearReddotApi({jobHunterUid: params.jobhunteruid, reddotType: 'red_dot_recruiter_view_item'}).then(() => {
        wx.navigateTo({url: `${COMMON}resumeDetail/resumeDetail?uid=${params.jobhunteruid}`})
      })
    } else {
      wx.navigateTo({url: `${COMMON}resumeDetail/resumeDetail?uid=${params.jobhunteruid}`})
    }
  },
  backHome(e) {
    wx.reLaunch({url: `${RECRUITER}index/index`})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   获取简历列表
   * @return   {[type]}   [description]
   */
  getViewList(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let params = {count: this.data.pageCount, page: this.data.viewList.pageNum}
      getCollectMySelfApi(params, hasLoading).then(res => {
        let onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        let viewList = this.data.viewList
        viewList.isLastPage = res.meta.nextPageUrl ? false : true
        viewList.pageNum = viewList.pageNum + 1
        viewList.isRequire = true
        viewList.list = viewList.list.concat(res.data)
        this.setData({viewList, onBottomStatus}, () => resolve(res))
      })
    })
  },
  formSubmit(e) {
    app.postFormId(e.detail.formId)
  },
  closeTips() {
    this.setData({showRules: false})
  },
  openTips(e) {
    let params = e.currentTarget.dataset
    let model = this.data.model
    model.show = true
    switch(params.type) {
      case 'position':
        model.title = '在招职位筛选'
        model.type = 'position'
        break
      case 'reduction':
        model.title = ''
        model.type = 'reduction'
        break
      case 'status':
        model.title = '处理状态'
        model.type = 'status'
        break
      case 'rules':
        model.title = '什么是简历储备'
        model.type = 'rules'
        break
      default:
        break
    }
    this.setData({model})
  },
  sChoice(e) {
    let params = e.currentTarget.dataset
    let model = this.data.model
    let viewList = this.data.viewList
    let statusLists = this.data.statusLists
    let positionChoose = this.data.positionChoose
    let statusChoose = this.data.statusChoose

    switch(params.type) {
      case 'status':
        statusLists.map((field, index) => {
          statusChoose = field
          field.active = index === params.index ? true : false
        })
        break
      case 'position':
        viewList.list.map((field, index) => {
          positionChoose = field
          field.active = index === params.index ? true : false
        })
        break
      default:
        break
    }
    this.setData({viewList, statusLists, positionChoose, statusChoose})
  },
  mChoice(e) {
    let params = e.currentTarget.dataset
    console.log(params)
  },
  lower(e) {
    console.log(e, 'gggggggggggg')
  },
})