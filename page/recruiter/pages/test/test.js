import {getSelectorQuery}  from '../../../../utils/util.js'
Page({
  data: {
    nav: ['首页', '测试测试测试2', '测试3', '测试测试4', '测试5', '测试6', '测试7', '尾页'],
    navTabIndex: 0,
    moveParams: {
      scrollLeft: 0
    }
  },
  onLoad() {
    getSelectorQuery('.tab-bar').then(res => {
      let moveParams = this.data.moveParams
      moveParams.screenHalfWidth = res.width / 2
      this.setData({moveParams})
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-07-08
   * @detail   选中当前的项
   * @return   {[type]}     [description]
   */
  clickNav(e) {
    let className = `.item${e.target.dataset.index}`
    this.setData({navTabIndex: e.target.dataset.index }, () => this.getRect(className))
  },
  /**
   * @Author   小书包
   * @DateTime 2019-07-08
   * @detail   获取当前选中的项
   * @return   {[type]}             [description]
   */
  getRect(className) {
    if(!className) return
    getSelectorQuery(className).then(res => {
      let moveParams = this.data.moveParams
      moveParams.subLeft = res.left
      moveParams.subHalfWidth = res.width / 2
      this.moveTo()
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-07-08
   * @detail   控制scroll-view
   * @return   {[type]}     [description]
   */
  scrollViewMove(e) {
    let moveParams = this.data.moveParams
    moveParams.scrollLeft = e.detail.scrollLeft
    this.setData({moveParams: moveParams })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-07-08
   * @detail   移动到指定位置
   * @return   {[type]}   [description]
   */
  moveTo() {
    let subLeft = this.data.moveParams.subLeft
    let screenHalfWidth = this.data.moveParams.screenHalfWidth
    let subHalfWidth = this.data.moveParams.subHalfWidth
    let scrollLeft = this.data.moveParams.scrollLeft
    let distance = subLeft - screenHalfWidth + subHalfWidth
    scrollLeft = scrollLeft + distance
    this.setData({scrollLeft: scrollLeft })
  }
})