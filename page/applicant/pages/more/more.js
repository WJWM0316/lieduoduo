// page/applicant/pages/more/more.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    tab: "all",
    childTabList:['广州','深圳','上海','北京','杭州','重庆','合肥'],
    nowIndex: 0,
    jobLabel: [],
    cityLabel: ['广州', '深圳', '上海', '北京', '杭州', '重庆', '合肥']
  },

  /**
   * 组件的方法列表
   */
  methods: {
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
//    console.log(e, '1111111111111')
    }
  },
  /* 标签初始化 */
  getLabelList () {}
})
