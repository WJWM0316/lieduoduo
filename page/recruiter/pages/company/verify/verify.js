import {
  getApplyjoinListApi
} from '../../../../../api/pages/recruiter.js'

const app = getApp()

Page({
  data: {
    navH: app.globalData.navHeight,
    tab: 'list0',
    pageCount: 20,
    hasReFresh: false,
    onBottomStatus: 0,
    list0: {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false
    },
    list1: {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false
    },
    list2: {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false
    }
  },
  onShow() {
  	this.getLists()
  },
  onClickTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({tab})
  },
  getLists() {
  	return this[`getApplyjoin${this.data.tab}`]()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-03-02
   * @detail   获取待审核列表
   */
  getApplyjoinlist0(hasLoading = true) {
  	return new Promise((resolve, reject) => {
      let params = {count: this.data.pageCount, page: this.data.list0.pageNum, hasLoading, status: 0}
      getApplyjoinListApi(params).then(res => {
        const list0 = this.data.list0
        const onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        list0.list = list0.list.concat(res.data)
        list0.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        list0.pageNum = list0.pageNum + 1
        list0.isRequire = true
        this.setData({list0, onBottomStatus}, () => resolve(res))
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-03-02
   * @detail   获取未通过列表
   */
  getApplyjoinlist2() {
  	return new Promise((resolve, reject) => {
      let params = {count: this.data.pageCount, page: this.data.list2.pageNum, hasLoading, status: 2}
      getApplyjoinListApi(params).then(res => {
        const list2 = this.data.list2
        const onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        list2.list = list2.list.concat(res.data)
        list2.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        list2.pageNum = list2.pageNum + 1
        list2.isRequire = true
        this.setData({list2, onBottomStatus}, () => resolve(res))
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-03-02
   * @detail   获取已通过列表
   */
  getApplyjoinlist1() {
  	return new Promise((resolve, reject) => {
      let params = {count: this.data.pageCount, page: this.data.list1.pageNum, hasLoading, status: 1}
      getApplyjoinListApi(params).then(res => {
        const list1 = this.data.list1
        const onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        list1.list = list1.list.concat(res.data)
        list1.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        list1.pageNum = list1.pageNum + 1
        list1.isRequire = true
        this.setData({list1, onBottomStatus}, () => resolve(res))
      })
    })
  }
})