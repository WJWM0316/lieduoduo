Component({
  properties: {
    infos: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    slogoIndex: 0,
    slogoList: [
      {
        id: 1,
        text: '工作不易，知音难觅，壮士约乎？工作不易，知音难觅，壮士约乎？'
      },
      {
        id: 1,
        text: '细节决定成败，态度决定一切。'
      },
      {
        id: 1,
        text: '彩虹风雨后，成功细节中。'
      },
      {
        id: 1,
        text: '态度决定一切，习惯成就未来。'
      }
    ]
  },
  ready() {
    this.setData({slogoIndex: this.getRandom()})
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getRandom() {
      return Math.floor(Math.random() * this.data.slogoList.length + 1)
    }
  }
})
