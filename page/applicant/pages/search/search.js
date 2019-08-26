
import {
  getKeyWordListApi,
  getHotKeyWordListApi,
  getSearchPositionListApi,
  getSearchConpanyListApi,
  getRecommendApi
} from '../../../../api/pages/search.js'
const app = getApp()
let timer = null,
    keyWord = '',
    lastWord = '记录上一条搜索词'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: app.globalData.navHeight,
    tabIndex: 0,
    keyWord: '',
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
    filterData: {},
    filterType: 'company'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let searchRecord = wx.getStorageSync('searchRecord') || []
    if (searchRecord.length) this.setData({historyList: searchRecord})
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
    keyWord = e.detail.value.trim()
    if (lastWord === keyWord) return
    lastWord = keyWord
    clearTimeout(timer)
    timer = setTimeout(() => {
      if (!keyWord) this.setData({keyWord}, () => {
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
    let searchRecord = this.data.historyList || []
    if (!searchRecord.some(item => { return item.word === word })) searchRecord.unshift({word, type: !this.data.tabIndex ? 1 : 2})
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
        word = keyWord
        break
      case 'label':
        word = dataset.item.word
        let tabIndex = dataset.item.type === 1 ? 0 : 1
        this.setData({tabIndex})
        break
    }
    lastWord = keyWord
    keyWord = word
    if (!keyWord) return
    this.resetList()
    this.updateHistory(keyWord)
    this.setData({keyWord: word, keyWordList: []}, () => {
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
        getRecommend = this.data.getRecommend,
        listType     = null,
        listFun      = null,
        listData     = null
    listType = tabIndex ? 'companyData' : !getRecommend ? 'positionData' : 'recommendList'
    listFun  = tabIndex ? getSearchConpanyListApi : !getRecommend ? getSearchPositionListApi : getRecommendApi
    listData = this.data[listType]
    listData.pageNum++
    let params = {
      page: listData.pageNum,
      count: app.globalData.pageCount,
      keyword: this.data.keyWord,
      recordParams: 1,
      ...this.data.filterData
    }
    return listFun(params, hasLoading).then(res => {
      listData.list.push(res.data)
      listData.isRequire = 1
      listData.isLastPage = (res.data.length < params.count) || (res.meta && parseInt(res.meta.currentPage) === res.meta.lastPage) ? 1 : 0
      listData.onBottomStatus = listData.isLastPage ? 2 : 0
      this.setData({[`${listType}`]: listData}, () => {
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
    if (!keyWord) return
    let params = {
      position: keyWord,
      count: 10
    }
    getKeyWordListApi(params).then(res => {
      let list = []
      res.data.map(field => {
        let item = {}
        item.word = field
        item.html = item.word.replace(new RegExp(keyWord,'g'),`<span style="color: #652791;font-weight: normal">${keyWord}</span>`)
        item.html = `<div>${item.html}</div>`
        list.push(item)
      })
      this.setData({keyWordList: list, keyWord})
    })
  },
  removeHistory () {
    this.setData({historyList: []}, () => {
      wx.removeStorageSync('searchRecord')
    })
  },
  removeWord () {
    if (!keyWord) return
    this.resetList()
    lastWord = keyWord
    keyWord = ''
    this.setData({keyWord})
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
  onShareAppMessage: function () {

  }
})