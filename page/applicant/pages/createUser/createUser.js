import wxAnimation from '../../../../utils/animation.js'
import {getSelectorQuery} from '../../../../utils/util.js'
import {getStepApi, getCreatFirstStepApi, postCreatFirstStepApi, getCreatSecondStepApi} from '../../../../api/pages/center.js'
import {COMMON, APPLICANT} from '../../../../config.js'
const app = getApp()
let timer = null,
    duration = 800 // 过场动画时间
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: app.globalData.navHeight,
    isBangs: app.globalData.isBangs,
    cdnImagePath: app.globalData.cdnImagePath,
    animationData: {},
    step: 0, // 创建步数
    active: null,
    avatar: {},
    gender: 1,
    name: '',
    birthDesr: '',
    birth: 0,
    startWorkYearDesc: '',
    startWork: 0,
    workCurrent: 0,
    workDate: [
      {
        companyName: '',
        positionType: '',
        positionName: '',
        starTime: 0,
        starTimeDesc: '',
        endTime: 0,
        endTimeDesc: '',
        workContent: ''
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getStep()
  },
  progress (step) {
    this.setData({step}, () => {
      this.setData({active: step})
      if (step !== 0 && step%2 !== 0) return
      timer = setTimeout(() => {
        step++
        if (step > 7) {
          clearTimeout(timer)   
        } else {
          this.progress(step)
        }
      }, duration)
    })
  },
  toggle (e) {
    let workCurrent = this.data.workCurrent
    let getData = e.currentTarget.dataset
    switch (getData.type) {
      case 'next':
        workCurrent++
        if (workCurrent > this.data.workDate.length - 1) workCurrent = 0
        break
      case 'prev':
        workCurrent--
        if (workCurrent < 0) workCurrent = this.data.workDate.length - 1
        break
      case 'change':
        workCurrent = e.detail.current
        break
      case 'index':
        workCurrent = getData.index
    }
    this.setData({workCurrent})
  },
  addItem (e) {
    let getData = e.currentTarget.dataset
    let type = ''
    let listKey = ''
    let list = []
    let current = 0
    switch (getData.type) {
      case 'work':
        listKey = 'workDate'
        type = 'workCurrent'
        current = this.data.workCurrent
        list = this.data.workDate
        break
    }
    list.push({})
    this.setData({[listKey]: list, [type]: list.length - 1})
  },
  remove (e) {
    let getData = e.currentTarget.dataset
    let type = ''
    let listKey = ''
    let list = []
    let current = 0
    switch (getData.type) {
      case 'work':
        listKey = 'workDate'
        type = 'workCurrent'
        current = this.data.workCurrent
        list = this.data.workDate
        break
    }
    list.splice(current, 1)
    if (current !== 0 && current === list.length - 1) {
      current --
      this.setData({[type]: current, [listKey]: list})
    } else {
      this.setData({[listKey]: list})
    }
  },
  continue () {
    this.postFirstFun('post').then(res => {
      let step = this.data.step
      step++
      this.progress(step)
    })
    
  },
  postFirstFun (type) {
    if (type === 'post') {
      let data = this.data
      let params = {
        avatar: data.avatar.id,
        gender: data.gender,
        name: data.name,
        birth: data.birth,
        startWorkYear: data.startWorkYear
      }
      return postCreatFirstStepApi(params)
    }
  },
  getStepData (step) {
    switch (step) {
      case 1:
        return getCreatFirstStepApi().then(res => {
          let avatar = res.data.avatar
          let birth = res.data.birth
          let birthDesc = res.data.birthDesc
          let gender = res.data.gender
          let name = res.data.name
          let startWorkYearDesc = res.data.startWorkYearDesc
          let startWorkYear = res.data.startWorkYear
          this.setData({name, gender, birth, birthDesc, startWorkYear, startWorkYearDesc})
        })
        break
      case 2:
        return getCreatSecondStepApi().then(res => {
        })
    }
  },
  getStep () {
    getStepApi().then(res => {
      let step = res.data.isFinished
      // this.getStepData(step)
      if (step > 0) this.setData({step: step + 1}, () => {
        this.progress(step + 1)
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let step = this.data.step
    this.progress(step)
  },
  getresult (e) {
    let getData = e.currentTarget.dataset
    let detail = e.detail
    switch (getData.type) {
      case 'workTime':
        this.setData({startWorkYearDesc: e.detail.propsDesc, startWorkYear: e.detail.propsResult})
        break
      case 'birth':
        this.setData({birthDesr: e.detail.propsDesc, birth: e.detail.propsResult})
        break
    }
    
  },
  chooseGender (e) {
    let getData = e.currentTarget.dataset
    this.setData({gender: getData.gender})
  },
  getValue (e) {
    clearTimeout(timer)
    let getData = e.currentTarget.dataset
    let value = e.detail.value
    let key = ''
    switch (getData.type) {
      case 'name':
        key = 'name'
        break
      case 'companyName':
        key = 'workDate'
        let workDate = this.data.workDate
        workDate[this.data.workCurrent].companyName = value
        value = workDate
        break
    }
    timer = setTimeout(() => {
      this.setData({[key]: value})
      clearTimeout(timer)
    }, 300)
  },
  jump (e) {
    let type = e.currentTarget.dataset.type
    let url = ''
    switch (type) {
      case 'companyName':
        url = `${APPLICANT}searchCompany/searchCompany`
        break
    }
    wx.navigateTo({url})
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let avatar = wx.getStorageSync('avatar')
    if (avatar) {
      this.setData({avatar})
    }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})