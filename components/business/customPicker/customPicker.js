import {getAreaListApi} from '../../../api/pages/label.js'
let lock = false
let pickerResult = {}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    openPicker: {
      type: Boolean,
      value: false
    },
    pickerType: {
      type: Object,
      value: []
    },
    activeIndex: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    pickerData: []
  },
  attached () {
    let pickerType = this.data.pickerType
    let pickerData = this.data.pickerData
    pickerType.forEach((item, index) => {
      switch (item.type) {
        case 'region':
          this.getRegionData().then(res => {
            let list = res.data
            pickerData[index] = [list, list[0].children]
            this.setData({pickerData})
            pickerResult['region'] = [0, 0]
          })
          break
      }
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getRegionData () {
      return getAreaListApi()
    },
    bindChange (e) {
      let value = e.detail.value
      switch (this.data.pickerType[this.data.activeIndex].type) {
        case 'region':
          let pickerData = this.data.pickerData
          if (pickerResult['region'][0] !== value[0]) {
            pickerData[this.data.activeIndex][1] = pickerData[this.data.activeIndex][0][value[0]].children
            this.setData({pickerData})
          }
          pickerResult['region'] = value
          break
      }
      
    },
    bindpickstart () {
      if (!lock) lock = true
    },
    bindpickend (e) {
      if (lock) lock = false
    },
    closePicker () {
      if (lock) return
      this.setData({
        openPicker: false
      })
      this.triggerEvent('resultevent', pickerResult)
    }
  }
})
