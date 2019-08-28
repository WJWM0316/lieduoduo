
import {
  getKeyWordListApi,
  getHotKeyWordListApi,
  getSearchPositionListApi,
  getSearchConpanyListApi,
  getRecommendApi
} from '../../../../api/pages/search.js'
import {COMMON, RECRUITER, APPLICANT} from '../../../../config.js'
const app = getApp()
let timer = null,
    keyword = '',
    lastWord = '记录上一条搜索词'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: app.globalData.navHeight,
    tabIndex: 0,
    keyword: '',
    hasFocus: false,
    keyWordList: [],
    getRecommend: false, // 获取推荐数据
    positionData: {
      list: [],
      pageNum: 0,
      onBottomStatus: 0,
      isLastPage: false,
      isRequire: false
    },
    recommendList: {
      list: [],
      pageNum: 0,
      onBottomStatus: 0,
      isLastPage: false,
      isRequire: false
    },
    companyData: {
      list: [],
      pageNum: 0,
      onBottomStatus: 0,
      isLastPage: false,
      isRequire: false
    },
    historyList: [],
    hotList: [],
    openPop: false,
    focus: false,
    filterData: {},
    filterType: 'company'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let searchRecord = wx.getStorageSync('searchRecord') || []
    if (searchRecord.length) this.setData({historyList: searchRecord})
    this.setData({focus: true})
    this.getHotKeyWordList()
  },
  bindblur () {
    this.setData({hasFocus: false})
  },
  bindfocus () {
    this.setData({hasFocus: true})
  },
  bindInput (e) {
    console.log(e)
    keyword = e.detail.value.trim()
    if (lastWord === keyword) return
    lastWord = keyword
    clearTimeout(timer)
    timer = setTimeout(() => {
      if (!keyword) this.setData({keyword}, () => {
        this.resetList()
      })
      this.getKeyWordList()
    }, 100)
  },
  bindconfirm (e) {
    e.currentTarget.dataset.type = 'searchBtn'
    this.choseKeyWord(e)
  },
  updateHistory (word) {
    if (!keyword) return
    let searchRecord = this.data.historyList || [],
        isRecordIndex= null
    // 判断该关键字是否已经存在，存在则位置提前，不存在则加到第一个
    
    searchRecord.forEach((item, index) => { if (item.word === word) isRecordIndex = index })
    if (!isRecordIndex && isRecordIndex !== 0) {
      searchRecord.unshift({word, type: !this.data.tabIndex ? 1 : 2})
    } else {
      searchRecord.splice(isRecordIndex, 1)
      searchRecord.unshift({word, type: !this.data.tabIndex ? 1 : 2})
    }
    if (searchRecord.length > 7)  searchRecord.pop(1)
    if (searchRecord.length) {
      wx.setStorageSync('searchRecord', searchRecord)
      this.setData({historyList: searchRecord})
    }
  },
  choseKeyWord (e) {
    let dataset = e.currentTarget.dataset,
        word    = ''
    switch (dataset.type) {
      case 'searchList':
        word = dataset.word
        break
      case 'searchBtn':
        word = keyword
        break
      case 'label':
        word = dataset.item.word
        let tabIndex = dataset.item.type === 1 ? 0 : 1
        this.setData({tabIndex})
        break
    }
    lastWord = keyword
    keyword = word
    this.resetList()
    this.updateHistory(keyword)
    this.setData({keyword, keyWordList: []}, () => {
      this.getSearchData()
    })
  },
  resetList () {
    this.setData({
      getRecommend: false,
      positionData: {list: [], pageNum: 0, onBottomStatus: 0, isLastPage: false},
      recommendList: {list: [], pageNum: 0, onBottomStatus: 0, isLastPage: false},
      companyData: {list: [], pageNum: 0, onBottomStatus: 0, isLastPage: false}
    })
  },
  toggleTab (e) {
    let index = e.currentTarget.dataset.index,
        type  = !index ? 'positionData' : 'companyData'
    this.setData({tabIndex: index}, () => {
      if (!this.data[type].isRequire) {
        this.getSearchData()
      }
    })
  },
  getSearchData (hasLoading = true) {
    let tabIndex     = this.data.tabIndex,
        keyword      = this.data.keyword,
        getRecommend = this.data.getRecommend,
        listType     = null,
        listFun      = null,
        listData     = null
    if (!keyword) return
    listType = tabIndex ? 'companyData' : !getRecommend ? 'positionData' : 'recommendList'
    listFun  = tabIndex ? getSearchConpanyListApi : !getRecommend ? getSearchPositionListApi : getRecommendApi
    listData = this.data[listType]
    listData.pageNum++
    let params = {
      page: listData.pageNum,
      count: app.globalData.pageCount,
      keyword,
      recordParams: 0,
      ...this.data.filterData
    }
    return listFun(params, hasLoading).then(res => {
      let isRequire = 1
      let isLastPage = (res.data.length < params.count) || (res.meta && parseInt(res.meta.currentPage) === res.meta.lastPage) ? 1 : 0
      let onBottomStatus = isLastPage ? 2 : 0
      let setData = {
        [`${listType}.pageNum`]: listData.pageNum,
        [`${listType}.isLastPage`]: isLastPage, 
        [`${listType}.isRequire`]: isRequire, 
        [`${listType}.onBottomStatus`]: onBottomStatus
      }
      tabIndex === 1 ? setData[`${listType}.list[${listData.pageNum - 1}]`] = res.data : setData[`${listType}.list`] = res.data
      this.setData(setData, () => {
        if (this.data.positionData.isLastPage && !this.data.tabIndex && !this.data.getRecommend) {
          this.setData({getRecommend: 1}, () => {
            this.getSearchData(false)
          })
        }
      })
    })
  },
  getHotKeyWordList () {
    getHotKeyWordListApi().then(res => {
      this.setData({hotList: res.data.items})
    })
  },
  getKeyWordList () {
    if (!keyword) return
    let params = {
      position: keyword,
      count: 10
    }
    getKeyWordListApi(params).then(res => {
      let list = []
      res.data.map(field => {
        let item = {}
        item.word = field
        item.html = item.word.replace(new RegExp(keyword,'g'),`<span style="color: #652791;font-weight: normal">${keyword}</span>`)
        item.html = `<div>${item.html}</div>`
        list.push(item)
      })
      this.setData({keyWordList: list, keyword})
    })
  },
  removeHistory () {
    this.setData({historyList: []}, () => {
      wx.removeStorageSync('searchRecord')
    })
  },
  removeWord () {
    if (!keyword) return
    this.resetList()
    lastWord = keyword
    keyword = ''
    this.setData({keyword, focus: true})
  },
  getFilterResult (e) {
    let filterData = e.detail
    this.setData({filterData}, () => {
      this.resetList()
      this.getSearchData()
    })
  },
  chooseType (e) {
    let type = e.currentTarget.dataset.type
    this.setData({filterType: type, openPop: true})
  },
  routeJump (e) {
    let route = e.currentTarget.dataset.route,
        item  = e.currentTarget.dataset.item
    switch (route) {
      case 'specialJob':
        wx.reLaunch({url: `${APPLICANT}specialJob/specialJob`})
        break
      case 'company':
        wx.navigateTo({url: `${COMMON}homepage/homepage?companyId=${item.id}`})
        break
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let tabIndex = this.data.tabIndex,
        listType = tabIndex ? 'companyData' : !this.data.getRecommend ? 'positionData' : 'recommendList'
    if (this.data[listType].isLastPage) return
    this.setData({[`${listType}.onBottomStatus`]: 1})
    this.getSearchData(false)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(options) {
　　return app.wxShare({options})
  }
})