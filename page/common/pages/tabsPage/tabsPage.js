// page/common/pages/tabsPage/tabsPage.js
import {getJobLabelApi, getLifeLableApi, addJobLabelApi, addLifeLabelApi, saveLabelApi} from '../../../../api/pages/common.js'
let allSkills = []
let choseFirstId = ''
let choseFirstIndex = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jobChoseNum: 0, // 职业标签选择的数量
    lifeChoseNum: 0, // 生活标签选择的数量
    pageType: 'job',
    num: 10, // 自定义字数
    customLabel: '', // 自定义标签
    choseJobList: [], // 选择职业标签
    choseLifeList: [], // 选择生活标签
    skills: [], // 职业二级标签
    literacy: [], // 职业素养标签
    character: [], // 性格标签
    interest: [], // 兴趣标签
    hidePop: true // 打开自定pop
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let character = []
    let interest = []
    let skills = []
    let literacy = []
    getJobLabelApi({type: 'all'}).then(res => {
      res.data.map((item, index) => {
        if (item.labelId === 100000) {
          allSkills = item.children
          allSkills.map((n, index) => {
            if (n.labelId === choseFirstId) {
              skills = allSkills[index].children
            }
          })
        }
        if (item.labelId === 200000) {
          literacy = item.children
        }
      })
      this.setData({skills, literacy})
    })
    getLifeLableApi().then(res => {
      res.data.map((item, index) => {
        if (item.labelId === 100000) {
          character = item.children
        }
        if (item.labelId === 120000) {
          interest = item.children
        }
      })
      this.setData({character, interest})
    })
  },
  openPop () {
    if (this.data.pageType === 'life') {
      if (this.data.lifeChoseNum < 5) {
        this.setData({hidePop: false})
      } else {
        getApp().wxToast({
          title: '选择标签已达上限'
        })
      }
    } else {
      if (this.data.jobChoseNum < 5) {
        this.setData({hidePop: false})
      } else {
        getApp().wxToast({
          title: '选择标签已达上限'
        })
      }
    }
    
  },
  getCustomLabel(e) {
    this.setData({
      num: 10 - e.detail.value.length,
      customLabel: e.detail.value
    })
  }, 
  getresult(e) {
    let skills = []
    choseFirstId = e.detail.propsResult.labelId
    if (allSkills.length > 0) {
      allSkills.map((n, index) => {
        if (n.labelId === choseFirstId) {
          skills = allSkills[index].children
          choseFirstIndex = index
          this.setData({skills})
        }
      })
    }
  },
  choseTab(e) {
    let list = []
    let labelList = []
    let labelType = ''
    let type = ''
    let typeNum = ''
    if (this.data.pageType === 'life') {
      list = this.data.choseLifeList
      type = 'choseLifeList'
      typeNum = 'lifeChoseNum'
    } else {
      list = this.data.choseJobList
      type = 'choseJobList'
      typeNum = 'jobChoseNum'
    }
    switch (e.target.dataset.labeltype) {
      case 'skills':
        labelType = 'skills'
        labelList = allSkills[choseFirstIndex].children
        break
      case 'literacy':
        labelType = 'literacy'
        labelList = this.data.literacy
        break
      case 'character':
        labelType = 'character'
        labelList = this.data.character
        break
      case 'interest':
        labelType = 'interest'
        labelList = this.data.interest
        break
      case 'choseJobList':
        labelType = 'choseJobList'
        labelList = this.data.choseJobList
        break
    }
    let choseData = e.target.dataset.tabdata
    labelList.map((item, index) => {
      if (item.labelId === choseData.labelId) {
        choseData.index = index
      }
    })
    if (choseData.checked) {
      labelList[choseData.index].checked = false
      list.map((item, index) => {
        if (item.labelId === choseData.labelId) {
          console.log(item, choseData.labelId, index)
          list.splice(index, 1)
          allSkills[choseFirstIndex].children[index].checked = false
          let skills = allSkills[choseFirstIndex].children
          console.log(index, skills)
          this.setData({skills})
        }
      })
    // 选中的
    } else {
      if (list.length === 5) { // 超过五个不给选择了
        getApp().wxToast({
          title: '选择标签已达上限'
        })
        return
      } else {
        choseData.checked = true
        list.push(choseData) // 不超过五个的，且没被选择的添加进去
        labelList[choseData.index].checked = true
      }
    }
    this.setData({[typeNum]: list.length, [type]: list, [labelType]: labelList})
  },
  addLabel() {
    if (this.data.customLabel === '') return
    let data = {
      name: this.data.customLabel
    }
    let list = []
    let type = ''
    let typeNum = ''
    let addLabelApi = null
    if (this.data.pageType === 'life') {
      addLabelApi = addLifeLabelApi
    } else {
      addLabelApi = addJobLabelApi
    }
    addLabelApi(data).then(res => {
      if (this.data.pageType === 'life') {
        list = this.data.choseLifeList
        type = 'choseLifeList'
        typeNum = 'lifeChoseNum'
      } else {
        list = this.data.choseJobList
        type = 'choseJobList'
        typeNum = 'jobChoseNum'
      }
      let data = res.data
      data.name = this.data.customLabel
      list.push(data)
      this.setData({
        num: 10,
        customLabel: '',
        [type]: list,
        [typeNum]: list.length,
        hidePop: true
      })
    }).catch(e => {
      if (e.code === 413) {
        this.setData({
          num: 10,
          customLabel: ''
        })
      }
    })
  },
  back() {
    if (this.data.pageType === 'left') {
      this.setData({
        pageType: 'job'
      })
    }
  },
  saveLabel() {
    let jobList = []
    let lifeList = []
    this.data.choseJobList.map((item, index) => {
      jobList.push({labelId: item.labelId, source: item.source})
    })
    this.data.choseLifeList.map((item, index) => {
      lifeList.push({labelId: item.labelId, source: item.source})
    })
    let data = {
      skillLabels: jobList,
      lifeLabels: lifeList
    }
    saveLabelApi(data).then(res => {
      console.log('保存成功')
    })
  },
  nextStep() {
    this.setData({
      pageType: 'life'
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})