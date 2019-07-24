import {
  getBrowseMySelfListsApi,
  getIndexShowCountApi,
  getReserveResumeSearchRangeListsApi,
  getReserveResumeSearchPositionRangeListsApi,
  getReserveResumeSearchListsApi
} from '../../../../api/pages/recruiter.js'

import {
  clearReddotApi
} from '../../../../api/pages/common.js'

import {RECRUITER, COMMON, APPLICANT, WEBVIEW, VERSION} from '../../../../config.js'

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
    resumeLists: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: 0
    },
    positionLists: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: 0
    },
    workExperience: [],
    salary: [],
    jobStatus: [],
    degrees: [],
    handleStatus: [],
    dealHandleStatus: {},
    dealPositionStatus: {},
    dealMultipleSelection: false
  },
  onShow() {
    this.init()
  },
  init() {
    this.getReserveResumeSearchPositionRangeList()
    this.getReserveResumeSearchRangeLists()
    this.getReserveResumeSearchLists()
  },
  getReserveResumeSearchRangeLists() {
    getReserveResumeSearchRangeListsApi().then(res => {
      this.setData({
        degrees: res.data.degrees,
        handleStatus: res.data.handleStatus,
        jobStatus: res.data.jobStatus,
        salary: res.data.salary,
        workExperience: res.data.workExperience
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   下拉重新获取数据
   * @return   {[type]}              [description]
   */
  onPullDownRefresh() {
    let resumeLists = {list: [], pageNum: 1, isLastPage: false, isRequire: false, onBottomStatus: 0}
    let positionLists = {list: [], pageNum: 1, isLastPage: false, isRequire: false, onBottomStatus: 0}
    this.setData({resumeLists, positionLists, hasReFresh: true}, () => {
      Promise.all([this.getReserveResumeSearchPositionRangeList(), this.getReserveResumeSearchLists()]).then(() => {
        this.setData({hasReFresh: false})
        wx.stopPullDownRefresh()
      })
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let resumeLists = this.data.resumeLists
    this.setData({onBottomStatus: 1})
    if (!resumeLists.isLastPage) this.init()
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
  getReserveResumeSearchPositionRangeList(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let positionLists = this.data.positionLists
      let params = {count: this.data.pageCount, page: positionLists.pageNum}
      getReserveResumeSearchPositionRangeListsApi(params, hasLoading).then(res => {
        let list = []
        if(!positionLists.list.length) {
          list.unshift({id: 0, positionName: '全部职位', active: false})
        }
        list = list.concat(res.data || [])
        positionLists.onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        positionLists.isLastPage = res.meta.nextPageUrl ? false : true
        positionLists.pageNum = positionLists.pageNum + 1
        positionLists.isRequire = true
        positionLists.list = list
        this.setData({positionLists}, () => resolve(res))
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   获取简历列表
   * @return   {[type]}   [description]
   */
  getReserveResumeSearchLists(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let resumeLists = this.data.resumeLists
      let params = {count: this.data.pageCount, page: resumeLists.pageNum, hasLoading}
      let dealHandleStatus = this.data.dealHandleStatus
      let dealPositionStatus = this.data.dealPositionStatus
      let salary = this.data.salary.filter(field => field.active).map(field => field.id)
      let jobStatus = this.data.jobStatus.filter(field => field.active).map(field => field.id)
      let degrees = this.data.degrees.filter(field => field.active).map(field => field.id)
      let workExperience = this.data.workExperience.filter(field => field.active).map(field => field.id)

      // 已经选择处理状态
      if(dealHandleStatus.id) params = Object.assign(params, {handleStatus: dealHandleStatus.id})
      // 已经选择职位
      if(dealPositionStatus.id) params = Object.assign(params, {positionId: dealPositionStatus.id})

      // 已经选择薪资
      if(salary.length) {
        if(salary.includes(1)) {
          params = Object.assign(params, {salaryIds: 1})
        } else {
          params = Object.assign(params, {salaryIds: salary.join(',')})
        }
      }
      // 已经选择求职状态
      if(jobStatus.length) {
        if(jobStatus.includes(0)) {
          params = Object.assign(params, {jobStatusIds: 0})
        } else {
          params = Object.assign(params, {jobStatusIds: jobStatus.join(',')})
        }
      }
      // 已经选择学习
      if(degrees.length) {
        if(degrees.includes(100)) {
          params = Object.assign(params, {degreeIds: 100})
        } else {
          params = Object.assign(params, {degreeIds: degrees.join(',')})
        }
      }
      // 已经选择学习
      if(workExperience.length) {
        if(workExperience.includes(1)) {
          params = Object.assign(params, {workExperienceIds: 1})
        } else {
          params = Object.assign(params, {workExperienceIds: workExperience.join(',')})
        }
      }

      getReserveResumeSearchListsApi(params).then(res => {
        resumeLists.onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        resumeLists.isLastPage = res.meta.nextPageUrl ? false : true
        resumeLists.pageNum = resumeLists.pageNum + 1
        resumeLists.isRequire = true
        resumeLists.list = resumeLists.list.concat(res.data)
        this.setData({resumeLists}, () => resolve(res))
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
  /**
   * @Author   小书包
   * @DateTime 2019-07-15
   * @detail   单选判断
   * @return   {[type]}     [description]
   */
  sChoice(e) {
    let params = e.currentTarget.dataset
    let model = this.data.model
    let positionLists = this.data.positionLists
    let dealPositionStatus = this.data.dealPositionStatus
    let handleStatus = this.data.handleStatus
    let dealHandleStatus = this.data.dealHandleStatus
    let resumeLists = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: 0
    }
    switch(params.type) {
      case 'status':
        handleStatus.map((field, index) => {
          field.active = false
          if(index === params.index) {
            dealHandleStatus = field
            field.active = true
            model.show = false
            model.title = ''
            model.type = ''
          }
        })
        break
      case 'position':
        positionLists.list.map((field, index) => {
          field.active = false
          if(index === params.index) {
            dealPositionStatus = field
            field.active = true
            model.show = false
            model.title = ''
            model.type = ''
          }
        })
        break
      default:
        break
    }
    this.setData({
      positionLists,
      dealPositionStatus,
      dealHandleStatus,
      handleStatus,
      model,
      resumeLists
    }, () => this.getReserveResumeSearchLists(true))
  },
  /**
   * @Author   小书包
   * @DateTime 2019-07-15
   * @detail   处理多选操作
   * @return   {[type]}     [description]
   */
  mChoice(e) {
    let params = e.currentTarget.dataset
    let degrees = this.data.degrees
    let jobStatus = this.data.jobStatus
    let salary = this.data.salary
    let workExperience = this.data.workExperience
    let item = this.data[params.type].find((field, index) => index === params.index)
    let mark = null
    let type = params.type
    let list = this.data[type]
    if(params.index) {
      list[0].active = false
      list.map((field, index) => {
        if(index === params.index) field.active = !field.active
      })
    } else {
      list.map(field => field.active = false)
      list[0].active = true
    }
    this.setData({[type]: list})
  },
  lower(e) {
    let positionLists = this.data.positionLists
    if (!positionLists.isLastPage) {
      this.getReserveResumeSearchPositionRangeList()
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-07-15
   * @detail   重置搜索条件
   * @return   {[type]}   [description]
   */
  reset() {
    let degrees = this.data.degrees
    let jobStatus = this.data.jobStatus
    let salary = this.data.salary
    let workExperience = this.data.workExperience
    degrees.map(field => field.active = false)
    jobStatus.map(field => field.active = false)
    salary.map(field => field.active = false)
    workExperience.map(field => field.active = false)
    this.setData({
      degrees,
      jobStatus,
      salary,
      workExperience
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-07-15
   * @detail   租合赛选简历
   * @return   {[type]}   [description]
   */
  submit() {
    let model = this.data.model
    let degrees = this.data.degrees
    let jobStatus = this.data.jobStatus
    let salary = this.data.salary
    let workExperience = this.data.workExperience
    let selectedsalary = this.data.salary.filter(field => field.active)
    let selectedjobStatus = this.data.jobStatus.filter(field => field.active)
    let selecteddegrees = this.data.degrees.filter(field => field.active)
    let selectedworkExperience = this.data.workExperience.filter(field => field.active)
    let dealMultipleSelection = this.data.dealMultipleSelection
    let resumeLists = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: 0
    }
    model.title = ''
    model.type = ''
    model.show = false
    if(selectedsalary.length || selectedjobStatus.length || selecteddegrees.length || selectedworkExperience.length) {
      dealMultipleSelection = true
    } else {
      dealMultipleSelection = false
    }
    this.setData({model, dealMultipleSelection, resumeLists}, () => this.getReserveResumeSearchLists(true))
  }
})