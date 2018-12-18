// page/applicant/pages/more/more.js
import { getJobLabelApi, getCityLabelApi } from '../../../../api/pages/common'
const app = getApp()
Page({
  /**
   * 初始数据
   */
  data: {
    tab: 'all',
    childTabList:['广州','深圳','上海','北京','杭州','重庆','合肥'],
    nowIndex: 0,
    jobLabel: [],
    cityLabel: ['广州', '深圳', '上海', '北京', '杭州', '重庆', '合肥']
  },
  /* 切换主tab */
  cutover(event) {
    this.setData({
      tab: event.target.dataset.tab
    })
  },
  /* 子级tab栏切换 */
  toggle(event) {
    this.setData({
      nowIndex: event.target.dataset.nowindex
    })
  },
  scroll (e) {},
  /* 翻页 */
  loadNext (e) {
    console.log(e, '1111111111111')
  },
  /* 标签初始化 */
  getJobLabelList () {
    return getJobLabelApi()
  },
  getCityLabel () {
    return getCityLabelApi()
  },
  onShow () {
    let that = this
    Promise.all([this.getCityLabel(), this.getJobLabelList()]).then(res => {
      that.setData({
        cityLabel: res[0].data,
        jobLabel: res[1].data
      })
    })
  }
})
