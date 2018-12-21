// page/common/pages/tabsPage/tabsPage.js
import {getJobLabelApi, getLifeLableApi, addJobLabelApi} from '../../../../api/pages/common.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    choseNum: 0, // 选择的数量
    labelType: 'life',
    customLabel: '', // 自定义标签
    choseJobList: [], // 选择职业标签
    choseLifeList: [], // 选择生活标签
    twoLevelList: [], // 职业二级标签
    literacy: [], // 职业素养标签
    character: [], // 性格标签
    interest: [] // 兴趣标签
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let character = []
    let interest = []
    getJobLabelApi({type: 'literacy'}).then(res => {
      console.log(res)
    })
    getLifeLableApi().then(res => {
      res.data.map((item, index) => {
        if (item.name === '性格') {
          character = item.children
        }
        if (item.name === '兴趣') {
          interest = item.children
        }
      })
      this.setData({character, interest})
    })
  },
  getCustomLabel(e) {
    this.setData({
      customLabel: e.detail.value
    })
  }, 
  getresult(e) {
    this.setData({
      twoLevelList: e.detail.propsResult.children || []
    })
  },
  choseTab(e) {
    let list = []
    let type = ''
    if (this.data.labelType === 'life') {
      list = this.data.choseLifeList
      type = 'choseLifeList'
    } else {
      list = this.data.choseJobList
      type = 'choseJobList'
    }
    let choseData = e.target.dataset.tabdata
    // 超过五个不给选择了
    if (list.length > 5) {
      return
    } else {
      let existIndex = null
      list.map((item, index) => {
        if (item.labelId === choseData.labelId) {
          existIndex = index
        }
      })
      // 不超过五个的，且没被选择的添加进去
      if (existIndex === null) {
        list.push(choseData)
      } else {
        list.splice(existIndex, 1)
      }
      this.setData({choseNum: list.length, [type]: list})
    }
  },
  addLabel() {
    if (this.data.customLabel === '') return
    let data = {
      name: this.data.customLabel
    }
    addJobLabelApi(data).then(res => {
      this.setData({
        customLabel: ''
      })
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