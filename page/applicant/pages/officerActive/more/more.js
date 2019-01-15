// page/applicant/pages/more/more.js
import { getPostionApi, getCityLabelApi } from '../../../../../api/pages/common'
import { getRankApi, getOfficeRankApi, getCityRankApi } from '../../../../../api/pages/active'
const app = getApp()
let param = {
      area_id: '',
      cate_id: '',
      count: 20,
      page: 1
    }
Page({
  /**
   * 初始数据
   */
  data: {
    tab: 'all',
    nowIndex: 0,
    jobLabel: [],
    cityLabel: [],
    list: [],
    cdnImagePath: app.globalData.cdnImagePath
  },
  toRecruitment (e) {
    console.log(1111)
    wx.navigateTo({ // 去招聘官主页
      url: `/page/common/pages/recruiterDetail/recruiterDetail?uid=${e.currentTarget.dataset.uid}`
    })
  },
  /* 切换主tab */
  cutover(event) {
    this.setData({
      tab: event.target.dataset.tab
    })
    this.handleListData()
  },
  /* 子级tab栏切换 */
  toggle(event) {
    param.page = 1
    if (this.data.tab === 'city') {
      param.area_id = event.currentTarget.dataset.item.areaId
    } else if (this.data.tab === 'office') {
      param.cate_id = event.currentTarget.dataset.item.labelId
    }
    this.setData({
      nowIndex: event.target.dataset.nowindex
    })
    this.handleListData()
  },
  scroll (e) {},
  /* 翻页 */
  loadNext (e) {
    console.log(e, '翻页')
  },
  /* 标签获取 */
  getJobLabelList () {
    return getPostionApi()
  },
  getCityLabel () {
    return getCityLabelApi()
  },
  /* 获取排行榜列表 */
  getRankData () {
    switch (this.data.tab) {
      case 'all':
        return getRankApi(param)
        break
      case 'city':
        return getCityRankApi(param)
        break
      case 'office':
        return getOfficeRankApi(param)
        break
    }
  },
  /* 榜单数据处理 */
  handleListData () {
    this.getRankData().then(res => {
      let first = null
      let nowList = null
      if (res.data.length >2) {
        first = res.data.splice(1, 1)
        res.data.unshift(first[0])
      }
      
      if (param.page === 1) {
        nowList = res.data
      } else {
        nowList = [...this.data.list, ...res.data]
      }
      this.setData({
        list: nowList
      })
    })
  },
  /* 初始化标签 */
  getTag () {
    return Promise.all([this.getCityLabel(), this.getJobLabelList()])
  },
  init () {
    let that = this
    this.getTag().then(res => {
      param.area_id = res[0].data[0].areaId
      param.cate_id = res[1].data[0].labelId
      that.setData({
        cityLabel: res[0].data,
        jobLabel: res[1].data
      })
      that.handleListData()
    })
//  getRankApi(param)
  },
  onShow () {
    this.init()
  }
})
