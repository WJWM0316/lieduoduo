// components/layout/bottomStatus/bottomStatus.js
Component({
  externalClasses: ['my-class', 'my-item-class'],
  properties: {
    status: {
      type: Number,
      value: 0 // 0 不存在 1 正在加载  2 没有更多数据
    },
    hasImg: {
      type: Boolean,
      value: true
    },
    listData: {
      type: Array,
      value: []
    },
    desc: {
      type: String,
      value: '暂无数据'
    },
    marginTop: {
      type: Number,
      value: 120
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    cdnImagePath: getApp().globalData.cdnImagePath
  },
  attached() {
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
