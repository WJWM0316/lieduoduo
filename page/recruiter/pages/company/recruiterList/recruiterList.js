import {getRecruitersListApi} from '../../../../../api/pages/company.js'

import {COMMON,RECRUITER} from "../../../../../config.js"

import { agreedTxtC, agreedTxtB } from '../../../../../utils/randomCopy.js'


let app = getApp()

Page({
  data: {
    pageCount: 20,
    hasReFresh: false,
    onBottomStatus: 0,
    recruitersList: {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false
    },
    isCompanyAdmin: 0,
    options: {}
  },
  onLoad(options) {
    let isCompanyAdmin = app.globalData.recruiterDetails.isCompanyAdmin || 0
    this.setData({options, isCompanyAdmin})
    this.getLists()
  },
  onShow() {
    let recruitersList = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    }
    this.setData({recruitersList})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-04
   * @detail   获取招聘团队
   * @return   {[type]}   [description]
   */
  getLists() {
    return new Promise((resolve, reject) => {
      const options = this.data.options
      const params = {id: options.companyId, page: this.data.recruitersList.pageNum, count: this.data.pageCount}
      getRecruitersListApi(params).then(res => {
        const recruitersList = this.data.recruitersList
        const onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        const list = res.data
        list.map(field => field.randomTxt = agreedTxtB())
        recruitersList.list = recruitersList.list.concat(list)
        recruitersList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        recruitersList.pageNum = recruitersList.pageNum + 1
        recruitersList.isRequire = true
        this.setData({recruitersList, onBottomStatus}, () => resolve(res))
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-24
   * @detail   申请转移权限
   * @return   {[type]}   [description]
   */
  authTransfer() {
  	const result = () => {
  		app.wxConfirm({
	      title: '申请成功',
	      content: `我们已收到您的申请，24小时内会有专人给您致电了解情况，请保持手机畅通。`,
	      showCancel: false,
	      confirmText: '知道了',
	      confirmBack: () => {}
	    })
  	}
  	app.wxConfirm({
      title: '申请转移管理权限',
      content: `您即将转移${'老虎科技'}的公司管理权限给${'陆强'}，确定转移吗？`,
      confirmBack: () => {
        result()
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-24
   * @detail   移除招聘官
   * @return   {[type]}   [description]
   */
  delete(e) {
  	const params = e.currentTarget.dataset
  	const result = (params) => {
  		let recruiterList = this.data.recruiterList
  		recruiterList = recruiterList.filter(field => field.uid !== params.uid)
  		this.setData(recruiterList)
  	}
  	app.wxConfirm({
      title: '移除招聘官',
      content: `即将从公司中移除${'陆强'}，该招聘官发布的职位将被关闭且无法继续进行招聘，确认移除吗?`,
      confirmText: '移除',
      confirmBack: () => {
        result(params)
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-24
   * @detail   选择当前招聘官
   * @return   {[type]}   [description]
   */
  select(e) {
  	const recruiterList = this.data.recruiterList
  	recruiterList.map((field, index) => field.active = index === params.active ? true : false)
  	this.setData({recruiterList})
  },
  jump(e) {
    const uid = e.currentTarget.dataset.uid
    wx.navigateTo({
      url: `${COMMON}recruiterDetail/recruiterDetail?uid=${uid}`
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   触底加载数据
   * @return   {[type]}   [description]
   */
  onReachBottom() {
    const recruitersList = this.data.recruitersList
    if (!recruitersList.isLastPage) {
      this.setData({onBottomStatus: 1})
      this.getLists(false)
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   下拉重新获取数据
   * @return   {[type]}              [description]
   */
  onPullDownRefresh() {
    const recruitersList = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
    this.setData({recruitersList, hasReFresh: true, onBottomStatus: 1})
    this.getLists().then(res => {
      const recruitersList = this.data.recruitersList
      const onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
      recruitersList.list = res.data
      recruitersList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
      recruitersList.pageNum = 2
      recruitersList.isRequire = true
      this.setData({recruitersList, onBottomStatus, hasReFresh: false}, () => wx.stopPullDownRefresh())
    })
  }
})