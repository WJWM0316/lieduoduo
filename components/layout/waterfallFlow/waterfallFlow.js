import {getSelectorQuery} from '../../../utils/util.js'

let leftGrounp    = [],    // 每竖的left值集合
    heightGroup   = [],    // 每竖的高度集合
    page          = 1,     // 页码
    minIndex      = 0,     // 高度最小的一竖索引
    curDataGroupIndex = 0 // 开始渲染的排数
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value: {               // 数据列表
      type: Object,
      value: []
    },
    page: {
      type: Number,        // 页码
      value: 0,
      observer (newVal, oldVal) {
        let listData = this.data.listData
        listData.push(this.data.value[this.data.value.length - 1])
        this.setData({listData}, () => {
          this.updata()
        })
      }
    },
    horizontal: {          // 每排展示数量
      type: Number,
      value: 2
    },
    spaceX: {            // 水平间距 (单位px)
      type: Number,
      value: 20
    },
    spaceY: {            // 垂直间距 (单位px)
      type: Number,
      value: 20
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    listData: []
  },

  attached () {
  },
  methods: {
    reset () {
      leftGrounp    = []
      heightGroup   = []
      page          = 1
      minIndex      = 0
      curDataGroupIndex = 0
      wx.nextTick(() => {
        this.typeset(this.data.listData[0])
      })
    },
    updata () {
      wx.nextTick(() => {
        this.typeset(this.data.listData[this.data.page - 1])
      })
    },
    typeset (list) {
      let that = this
      let minFun = (heightGroup) => {
        return minIndex = heightGroup.indexOf(Math.min(...heightGroup))
      }
      let array = list
      array.forEach((item, index) => {
        getSelectorQuery(`.flow${this.data.page - 1}${index}`, that).then(res => {
          array[index].width = res.width
          array[index].index = index
          array[index].height = res.height
          if (index % this.data.horizontal === 0) { // 每排数据开始重置一下dataGroup
            curDataGroupIndex++
          }
          if (curDataGroupIndex === 1) { // 第一排需要特殊处理 top = 0
            array[index].top = 0
            if (index === 0) {
              array[index].left = 0
            } else {
              array[index].left = array[index - 1].left + array[index - 1].width + this.data.spaceX
            }
            heightGroup.push(res.height) // 记录每路的高度
            leftGrounp.push(array[index].left) // 记录每路的left
          }
          if (curDataGroupIndex > 1) { // 从第二排开始布局
            minIndex = minFun(heightGroup)
            array[index].left = leftGrounp[minIndex]
            array[index].top = heightGroup[minIndex] + this.data.spaceY
            heightGroup[minIndex] = array[index].top + array[index].height // 重置每路的高度
          }
          if (index === list.length - 1) {
            this.setData({[`listData[${this.data.page - 1}]`]: array})
          }
        })
      })
    }
  }
})