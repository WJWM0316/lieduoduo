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
    let pickerType = this.data.pickerType,
        pickerData = this.data.pickerData,
        curYear = new Date().getFullYear(),
        month = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    pickerType.forEach((item, index) => {
      switch (item.type) {
        case 'region':
          this.getRegionData().then(res => {
            let list = res.data
            pickerData[index] = [list, list[0].children]
            // if (pickerResult['region'].value) {

            // }
            pickerResult['region'] = {
              pidIndex: 0,
              index: 0,
              key: list[0].children[0].title,
              value: list[0].children[0].areaId
            }
            this.setData({pickerData})
          })
          break
        case 'birthday':
          let year = []
          for (let i = curYear - 15; i > curYear - 65; i--) {
            year.push(`${i}`)
          }
          pickerData[index] = [year, month]
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
      let pickerType = this.data.pickerType
      switch (pickerType[this.data.activeIndex].type) {
        case 'region':
          let pickerData = this.data.pickerData,
              children = pickerData[this.data.activeIndex][0][value[0]].children
          if (!pickerResult['region'] || pickerResult['region'].index !== value[0]) {
            pickerData[this.data.activeIndex][1] = children
            this.setData({pickerData})
          }
          pickerResult['region'] = {
            pidIndex: value[0],
            index: value[1],
            key: children[value[1]].title,
            value: children[value[1]].areaId
          }
          pickerType.forEach((item, index) => {
            if (item.type === 'region') {
              item.value = pickerData[this.data.activeIndex][0][value[0]].children[value[1]].title
              return
            }
          })
          this.setData({pickerType})
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
