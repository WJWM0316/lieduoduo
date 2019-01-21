import {getTopicListApi} from '../../../../../api/pages/recruiter.js'

import {RECRUITER} from '../../../../../config.js'

let app = getApp()

Page({
  data: {
    list: [],
    pageNum: 1,
    isLastPage: false,
    isRequire: false,
    onBottomStatus: 0,
    pageCount: app.globalData.pageCount
  },
  onLoad(options) {
    this.getTopicList()
  },
  getTopicList(hasLoading = true) {
    const params = {count: this.data.pageCount, page: this.data.pageNum, hasLoading}
    getTopicListApi(params)
      .then(res => {
        const list = this.data.list.concat(res.data)
        const isLastPage = res.meta.nextPageUrl ? false : true
        const pageNum = this.data.pageNum + 1
        const isRequire = true
        const onBottomStatus = res.meta.nextPageUrl ? 0 : 2
        this.setData({list, isLastPage, pageNum, isRequire, onBottomStatus})
      })
  },
  addTop(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `${RECRUITER}user/editDeclaration/editDeclaration?topicId=${item.id}&title=${item.title}`
    })
  },
  onPullDownRefresh(hasLoading = true) {
    const params = {count: this.data.pageCount, page: 1, hasLoading}
    getTopicListApi(params)
      .then(res => {
        const list = res.data
        const isLastPage = res.meta.nextPageUrl ? false : true
        const pageNum = 1
        const isRequire = true
        const onBottomStatus = res.meta.nextPageUrl ? 0 : 2
        this.setData({list, isLastPage, pageNum, isRequire, onBottomStatus}, () => {
          wx.stopPullDownRefresh()
        })
      })
  },
  onReachBottom() {
    this.getTopicList()
  }
})