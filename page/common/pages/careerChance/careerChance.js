
import {RECRUITER, APPLICANT, COMMON} from '../../../../config.js'

import {getSelectorQuery}  from '../../../../utils/util.js'

import { getPositionListApi, getPositionRecordApi, getEmolumentApi } from '../../../../api/pages/position.js'

import {
  getCityLabelApi
} from '../../../../api/pages/common'

import {
  getLabelPositionApi
} from '../../../../api/pages/label.js'

import {shareChance} from '../../../../utils/shareWord.js'

const app = getApp()
let identity = ''
Page({
  data: {
    pageCount: 20,
    navH: app.globalData.navHeight,
    fixedBarHeight: 0,
    hasReFresh: false,
    onBottomStatus: 0,
    tabList: [
      {
        name: '选择地区',
        type: 'city'
      },
      {
        name: '选择类型',
        type: 'positionType'
      },
      {
        name: '薪资范围',
        type: 'salary'
      }
    ],
    positionList: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    },
    tabType: 'closeTab',
    city: 0,
    cityIndex: 0,
    type: 0,
    typeIndex: 0,
    emolument: 0,
    emolumentIndex: 0,
    cityList: [],
    positionTypeList: [],
    emolumentList: [],
    requireOAuth: false,
    cdnImagePath: app.globalData.cdnImagePath
  },

  onLoad(options) {
    identity = app.identification(options)
    const positionList = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    }
    this.setData({positionList})
    if (app.loginInit) {
      Promise.all([this.getCityLabel(), this.getLabelPosition(), this.getEmolument()]).then(res => {
        this.getPositionRecord()
      })
    } else {
      app.loginInit = () => {
        Promise.all([this.getCityLabel(), this.getLabelPosition(), this.getEmolument()]).then(res => {
          this.getPositionRecord()
        })
      }
    }
    if (wx.getStorageSync('choseType') === 'RECRUITER') {
      app.wxConfirm({
        title: '提示',
        content: '检测到你是招聘官，是否切换招聘端',
        confirmBack() {
          wx.reLaunch({
            url: `${RECRUITER}index/index`
          })
        },
        cancelBack() {
          wx.setStorageSync('choseType', 'APPLICANT')
          app.getAllInfo()
        }
      })
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-24
   * @detail   获取热门城市
   * @return   {[type]}   [description]
   */
  getCityLabel() {
    return getCityLabelApi().then(res => {
      const cityList = res.data
      cityList.unshift({areaId: '', name: '全部地区'})
      this.setData({cityList})
    })
  },
  choseTab (e) {
    let closeTab = e.currentTarget.dataset.type
    if (this.data.tabType === closeTab || closeTab === 'closeTab') {
      this.setData({tabType: 'closeTab'})
    } else {
      this.setData({tabType: closeTab})
    }
  },
  toggle (e) {
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    switch (this.data.tabType) {
      case 'city':
        this.setData({city: id, cityIndex: index, tabType: 'closeTab'})
        this.reloadPositionLists()
        break
      case 'positionType':
        this.setData({type: id, typeIndex: index, tabType: 'closeTab'})
        this.reloadPositionLists()
        break
      case 'salary':
        this.setData({emolument: id, emolumentIndex: index, tabType: 'closeTab'})
        this.reloadPositionLists()
        break
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-23
   * @detail   获取技能标签
   * @return   {[type]}   [description]
   */
  getLabelPosition() {
    return getLabelPositionApi().then(res => {
      const positionTypeList = res.data
      positionTypeList.map(field => field.active = false)
      positionTypeList.unshift({
        labelId: '',
        name: '全部类型',
        type: 'self_label_position'
      })
      this.setData({positionTypeList})
    })
  },
  getPositionRecord() {
    getPositionRecordApi().then(res => {
      let city = this.data.city
      let type = this.data.type
      let emolument = this.data.emolument
      let cityIndex = this.data.cityIndex
      let typeIndex = this.data.typeIndex
      let emolumentIndex = this.data.emolumentIndex
      if (res.data.city) {
        city = Number(res.data.city)
        this.data.cityList.map((item, index) => {
          if (item.areaId === city) {
            cityIndex = index
          }
        })
      }
      if (res.data.type) {
        type = Number(res.data.type)
        this.data.positionTypeList.map((item, index) => {
          if (item.labelId === type) {
            typeIndex = index
          }
        })
      }
      if (res.data.emolumentId) {
        emolument = Number(res.data.emolumentId)
        this.data.emolumentList.map((item, index) => {
          if (item.id === emolument) {
            emolumentIndex = index
          }
        })
      }
      this.setData({city, type, cityIndex, typeIndex, emolument, emolumentIndex}, () => {
        this.getPositionList()
      })  
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   获取职位列表
   * @return   {[type]}   [description]
   */
  getPositionList(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let params = {count: this.data.pageCount, page: this.data.positionList.pageNum, ...app.getSource()}
      if(this.data.city) {
        params = Object.assign(params, {city: this.data.city})
      }
      if(this.data.type) {
        params = Object.assign(params, {type: this.data.type})
      }
      if (this.data.emolument) {
        params = Object.assign(params, {emolument_id: this.data.emolument})
      }
      if(!this.data.type) {
        delete params.type
      }
      if(!this.data.city) {
        delete params.city
      }
      if(!this.data.emolument) {
        delete params.emolument_id
      }
      getPositionListApi(params, hasLoading).then(res => {
        const positionList = this.data.positionList
        const onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        let requireOAuth = res.meta.requireOAuth || false
        positionList.list = positionList.list.concat(res.data)
        positionList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        positionList.pageNum = positionList.pageNum + 1
        positionList.isRequire = true
        this.setData({positionList, requireOAuth, onBottomStatus}, () => resolve(res))
      })
    })
  },
  getEmolument () {
    getEmolumentApi().then(res => {
      this.setData({emolumentList: res.data})
    })
  },
  authSuccess() {
    let requireOAuth = false
    this.setData({requireOAuth})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-24
   * @detail   刷新数据
   * @return   {[type]}   [description]
   */
  reloadPositionLists(hasLoading = true) {
    const positionList = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
    this.setData({positionList, hasReFresh: true})
    return this.getPositionList().then(res => {
      const positionList = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
      const onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
      positionList.list = res.data
      positionList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
      positionList.pageNum = 2
      positionList.isRequire = true
      this.setData({positionList, onBottomStatus, hasReFresh: false}, () => wx.stopPullDownRefresh())
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   下拉重新获取数据
   * @return   {[type]}              [description]
   */
  onPullDownRefresh() {
    this.reloadPositionLists().then(res => {
      wx.stopPullDownRefresh()
    }).catch(e => {
      wx.stopPullDownRefresh()
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   触底加载数据
   * @return   {[type]}   [description]
   */
  onReachBottom() {
    const positionList = this.data.positionList
    if (!positionList.isLastPage) {
      this.getPositionList(false).then(() => this.setData({onBottomStatus: 1}))
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-24
   * @detail   类型改变重新拉数据
   * @return   {[type]}     [description]
   */
  // bindChange(e) {
  //   const params = e.currentTarget.dataset
  //   const list = params.type === 'city' ? this.data.cityList : this.data.positionTypeList
  //   const result = list.find((field, index) => index === Number(e.detail.value))
  //   const type = params.type
  //   const otherParamsIndex = params.type === 'city' ? 'cityIndex' : 'typeIndex'
  //   const otherParamValue = result[params.type === 'city' ? 'areaId' : 'labelId']
  //   const positionList = this.data.positionList
  //   positionList.pageNum = 1

  //   if(typeof otherParamValue === 'number') {
  //     this.setData({[type]: otherParamValue, [otherParamsIndex]: Number(e.detail.value)}, () => this.reloadPositionLists())
  //   } else {
  //     this.setData({[type]: 0, [otherParamsIndex]: 0, positionList}, () => 
  //   }
  // },
  onShareAppMessage(options) {
    let that = this
　　return app.wxShare({
      options,
      title: shareChance,
      path: `${COMMON}careerChance/careerChance`,
      imageUrl: `${this.data.cdnImagePath}positionList.png`
    })
  }
})
