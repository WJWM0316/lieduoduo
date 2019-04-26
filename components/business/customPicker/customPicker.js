import {getAreaListApi} from '../../../api/pages/label.js'
let lock = false,
    pickerResult = {},
    curYear = new Date().getFullYear(),
    month = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
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
        year = []
    for (let i = 0; i < 65; i++) {
      year.push(`${curYear}`)
      curYear--
    } 
    pickerType.forEach((item, index) => {
      switch (item.type) {
        case 'region':
          this.getRegionData().then(res => {
            var result = []
            var list = res.data
            if (item.value) {
              for (var i = 0; i < list.length; i++) {
                if (list[i].areaId === item.pid) {
                  for (var j = 0; j < list[i].children.length; j++) {
                    if (list[i].children[j].title === item.value) {
                      result = [i, j]
                      break
                    }
                  }
                }
              }
            } else {
              result = [0, 0]
              item.value = '北京市'
            }
            pickerData[index] = [list, list[result[0]].children]
            item.result = result
            this.setData({pickerData, pickerType})
          })
          break
        case 'birthday':
          var birthYear = [],
              result = []
          for (let i = curYear - 15; i > curYear - 65; i--) {
            birthYear.push(`${i}`)
          }
          pickerData[index] = [birthYear, month]
          if (item.value) {
            result[0] = birthYear.indexOf(`${item.value.slice(0, 4)}`)
            result[1] = month.indexOf(item.value.slice(5, 8))
          } else {
            result = [0, 0]
          }
          item.result = result
          this.setData({pickerData, pickerType}, () => {
          })
          break
        case 'workTime':
          var result = [],
              workTimeYear = []
          workTimeYear = workTimeYear.concat(year)
          workTimeYear.unshift('在校生')
          
          if (item.value) {
            result[0] = workTimeYear.indexOf(`${item.value.slice(0, 4)}`)
            result[1] = month.indexOf(item.value.slice(5, 8))
          } else {
            result = [0, 0]
          }
          if (result[0] === 0) {
            pickerData[index] = [workTimeYear, ['在校生']]
          } else {
            pickerData[index] = [workTimeYear, month]
          }
          item.result = result
          this.setData({pickerData, pickerType}, () => {
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
      let value = e.detail.value,
          pickerType = this.data.pickerType,
          pickerData = this.data.pickerData
      switch (pickerType[this.data.activeIndex].type) {
        case 'region':
          var children = pickerData[this.data.activeIndex][0][value[0]].children
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
              item.result = value
              return
            }
          })
          this.setData({pickerType})
          break
        case 'birthday':
          var children = []
          if (!pickerResult['birthday'] || pickerResult['birthday'].index !== value[0]) {
            children = ['在校生']
            pickerData[this.data.activeIndex][1] = children
            this.setData({pickerData})
          } else {
            if (children !== ['在校生']) {
              pickerData[this.data.activeIndex][1] = children
              this.setData({pickerData})
            }
          }
          pickerResult['birthday'] = {
            pidIndex: value[0],
            index: value[1],
            key: `${pickerData[this.data.activeIndex][0]}-${children[value[1]]}`,
            value: 0
          }
          pickerType.forEach((item, index) => {
            if (item.type === 'region') {
              item.value = pickerData[this.data.activeIndex][0][value[0]].children[value[1]].title
              item.result = value
              return
            }
          })
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
