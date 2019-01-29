import {
  getPostionApi,
  getCityLabelApi
} from '../../../../../api/pages/common'

import {
  getRankApi,
  getOfficeRankApi,
  getCityRankApi
} from '../../../../../api/pages/active'

const app = getApp()

Page({
  data: {
    tab: 'rankAll',
    nowIndex: 0,
    jobLabel: [],
    cityLabel: [],
    cdnImagePath: app.globalData.cdnImagePath,
    rankAll: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    },
    rankCate: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    },
    rankCity: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    },
    commonList: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    },
    // pageCount: app.globalData.pageCount,
    pageCount: 10,
    hasReFresh: false,
    onBottomStatus: 0,
    area_id: '',
    cate_id: ''
  },
  onLoad() {
    this.getLists().then(() => this.getSubmenuLists())
  },
  toRecruitment (e) {
    wx.navigateTo({
      url: `/page/common/pages/recruiterDetail/recruiterDetail?uid=${e.currentTarget.dataset.uid}`
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-22
   * @detail   父级菜单切换
   * @return   {[type]}     [description]
   */
  onTabClick(e) {
    const key = e.target.dataset.tab
    const value = this.data[key]
    this.setData({tab: key, commonList: value}, () => {
      if(!value.isRequire) this.getLists()
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-22
   * @detail   子菜单切换
   * @return   {[type]}         [description]
   */
  toggle(e) {
    const tab = this.data.tab === 'rankCity' ? 'area_id' : 'cate_id'
    const key = this.data.tab
    const value = this.data[key]
    value.pageNum = 1
    const params = e.currentTarget.dataset
    this.setData({nowIndex: params.nowindex, [tab]: params.id, [key]: value}, () => {
      const key = this.data.tab
      const value = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
      this.setData({[key]: value})
      this.getLists().then(res => {
        const value = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
        const onBottomStatus = res.meta.nextPageUrl ? 0 : 2
        value.list = res.data
        value.isLastPage = res.meta.nextPageUrl ? false : true
        value.pageNum = 2
        value.isRequire = true
        this.setData({[key]: value, onBottomStatus})
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-22
   * @detail   获取职位榜单子菜单数据
   * @return   {[type]}   [description]
   */
  getJobLabelList () {
    return getPostionApi()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-22
   * @detail   获取城市榜单子菜单数据
   * @return   {[type]}   [description]
   */
  getCityLabel () {
    return getCityLabelApi()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   获取标签列表
   * @return   {[type]}   [description]
   */
  getSubmenuLists() {
    Promise
      .all([this.getCityLabel(), this.getJobLabelList()])
      .then(res => {
        this.setData({
          cityLabel: res[0].data,
          jobLabel: res[1].data,
          area_id: res[0].data[0].areaId,
          cate_id: res[1].data[0].labelId
        })
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   获取列表数据
   * @return   {[type]}   [description]
   */
  getLists() {
    switch(this.data.tab) {
      case 'rankAll':
        return this.getRankAll()
        break;
      case 'rankCate':
        return this.getRankCate()
        break;
      case 'rankCity':
        return this.getRankCity()
        break;
      default:
        break;
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   获取职城市类型榜单列表
   * @return   {[type]}   [description]
   */
  getRankCity(hasLoading = true) {
    return new Promise((resolve, reject) => {
      const params = {count: this.data.pageCount, page: this.data.rankCity.pageNum, hasLoading, area_id: this.data.area_id}
      getCityRankApi(params).then(res => {
        const rankCity = this.data.rankCity
        const onBottomStatus = res.meta.nextPageUrl ? 0 : 2
        rankCity.list = rankCity.list.concat(res.data)
        rankCity.isLastPage = res.meta.nextPageUrl ? false : true
        rankCity.pageNum = rankCity.pageNum + 1
        rankCity.isRequire = true
        const firstItem = rankCity.list[1]
        if(rankCity.list[0].influence > firstItem.influence) {
          rankCity.list = rankCity.list.filter(field => field.uid !== firstItem.uid)
          rankCity.list.unshift(firstItem)
        }
        this.setData({rankCity, onBottomStatus, commonList: rankCity}, () => resolve(res))
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   获取职位类型榜单列表
   * @return   {[type]}   [description]
   */
  getRankCate(hasLoading = true) {
    return new Promise((resolve, reject) => {
      const params = {count: this.data.pageCount, page: this.data.rankCate.pageNum, hasLoading, cate_id: this.data.cate_id}
      getOfficeRankApi(params).then(res => {
        const rankCate = this.data.rankCate
        const onBottomStatus = res.meta.nextPageUrl ? 0 : 2
        rankCate.list = rankCate.list.concat(res.data)
        rankCate.isLastPage = res.meta.nextPageUrl ? false : true
        rankCate.pageNum = rankCate.pageNum + 1
        rankCate.isRequire = true
        const firstItem = rankCate.list[1]
        if(rankCate.list[0].influence > firstItem.influence) {
          rankCate.list = rankCate.list.filter(field => field.uid !== firstItem.uid)
          rankCate.list.unshift(firstItem)
        }
        this.setData({rankCate, onBottomStatus, commonList: rankCate}, () => resolve(res))
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   获取总榜单列表
   * @return   {[type]}   [description]
   */
  getRankAll(hasLoading = true) {
    return new Promise((resolve, reject) => {
      const params = {count: this.data.pageCount, page: this.data.rankAll.pageNum, hasLoading}
      getRankApi(params).then(res => {
        const rankAll = this.data.rankAll
        const onBottomStatus = res.meta.nextPageUrl ? 0 : 2
        rankAll.list = rankAll.list.concat(res.data)
        rankAll.isLastPage = res.meta.nextPageUrl ? false : true
        rankAll.pageNum = rankAll.pageNum + 1
        rankAll.isRequire = true
        const firstItem = rankAll.list[1]
        if(rankAll.list[0].influence > firstItem.influence) {
          rankAll.list = rankAll.list.filter(field => field.uid !== firstItem.uid)
          rankAll.list.unshift(firstItem)
        }
        this.setData({rankAll, onBottomStatus, commonList: rankAll}, () => resolve(res))
      })
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
      const onBottomStatus = res.meta.nextPageUrl ? 0 : 2
      value.list = res.data
      value.isLastPage = res.meta.nextPageUrl ? false : true
      value.pageNum = 1
      value.isRequire = true
      this.setData({[key]: value, onBottomStatus, hasReFresh: false}, () => wx.stopPullDownRefresh())
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
      this.getLists(false).then(() => this.setData({onBottomStatus: 1}))
    }
  }
})
