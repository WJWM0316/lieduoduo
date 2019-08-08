let timer = null,
    duration = 2000
Component({
  externalClasses: ['my-class', 'my-item-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    index: 0,
    active: false,
    hide: false,
    item: '',
    isIphoneX: getApp().globalData.isIphoneX
  },
  attached () {
    this.showBarrage()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    showBarrage () {
      timer = setTimeout(() => {
        let index = this.data.index + 1
        this.setData({active: true, item: this.data.list[this.data.index], index: index})
        duration = Math.floor(Math.random() * 2000 + 2000);
        let timer1 = setTimeout(() => {
          this.setData({hide: true})
          let timer2 = setTimeout(() => {
            this.setData({active: false, hide: false})
            clearTimeout(timer2)
            if (index <= this.data.list.length - 1) {
              this.showBarrage()
            }
          }, 500)
          clearTimeout(timer1)
        }, 2000)
        clearTimeout(timer)
      }, duration)
    }
  }
})
