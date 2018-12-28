// components/layout/myPicker/myPicker.js
import {getJobLabelApi} from '../../../api/pages/common.js'
Component({
  externalClasses: ['my-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    pickerType: {
      type: String,
      value: ''
    },
    setResult: {
      type: String
    },
    rangeKey: {
      type: String,
      value: null
    },
    placeholderStyle: {
      type: String
    },
    needSlot: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    result: 0, // picker选择value
    list: [], // picker列表
    mode: '', // picker mode
    firstOption: '', // 自定义选型
    placeholder: '', // placeholder
    financing: [{name: '未融资', value: 1}, {name: '天使轮', value: 2}, {name: 'A轮', value: 3}, {name: 'B轮', value: 4}, {name: 'C轮', value: 5}, {name: 'D轮及以上', value: 6}, {name: '已上市', value: 7}, {name: '不需要融资', value: 8}],
    staffMembers: [{name: '0-20人', value: 1}, {name: '20-99人', value: 2}, {name: '100-499人', value: 3}, {name: '500-999人', value: 4}, {name: '1000人-9999人', value: 5}, {name: '10000人以上', value: 6}],
    experience: [{name: '不限', value: 1}, {name: '应届生', value: 2}, {name: '1以内', value: 3}, {name: '1-3', value: 4}, {name: '3-5', value: 5}, {name: '5-10', value: 6}, {name: '10以上', value: 7}],
    jobStatus: [{name: '离职，随时到岗', value: 2}, {name: '在职，暂不考虑', value: 1}, {name: '在职，考虑机会', value: 4}, {name: '在职，内到岗', value: 3}],
    education: [{name: '博士', value: 35}, {name: '硕士', value: 30}, {name: '本科', value: 25}, {name: '大专', value: 20}, {name: '中专/中技', value: 15}, {name: '高中', value: 10}, {name: '初中及以下', value: 5}],
    sex: [{name: '男', value: 1}, {name:'女', value: 2}],
    dateType: ['startTime', 'endTime', 'workTime', 'dateTime', 'birthday'],
    year: [],
    month: ['12', '11', '10', '09', '08', '07', '06', '05','04', '03', '02', '01'],
    days: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
    hours: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
    minutes: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']
  },
  attached: function () {
    let list = []
    let result = null
    let firstOption = null
    let curYear = new Date().getFullYear()
    let curMonth = new Date().getMonth() + 1
    let year = []
    if (this.data.dateType.indexOf(this.data.pickerType) !== -1) {
      for (let i = 0; i < 65; i++) {
        year.push(`${curYear}`)
        curYear--
      }
    }
    const setResult = () => {
      result = []
      if (this.data.setResult === '至今' || this.data.setResult === '在校生') {
        result = [0, 0]
      } else {
        result[0] = year.indexOf(this.data.setResult.slice(0, 5))
        result[1] = this.data.month.indexOf(this.data.setResult.slice(5, 8))
      }
      if (result[0] === -1) { // 开启palceholder
        result = 0
      }
      return result
    }
    switch (this.data.pickerType) {
      case 'birthday':
        for (let i = curYear - 18; i > curYear - 65; i--) {
          year.push(`${i}`)
        }
        list.push(year)
        list.push(this.data.month)
        result = setResult()
        this.setData({list, year, result, mode: 'multiSelector', placeholder: '请选择生'})
        break
      case 'startTime':
        list.push(year)
        list.push(this.data.month)
        result = setResult()
        this.setData({list, year, result, mode: 'multiSelector', placeholder: '请选择开始时间'})
        break
      case 'endTime':
        firstOption = '至今'
        year.unshift(firstOption)
        list.push(year)
        result = setResult()
        if (result !== 0) {
          list.push(this.data.month)
        } else {
          list.push([firstOption])
        }
        this.setData({list, year, result, mode: 'multiSelector', firstOption, placeholder: '请选择结束时间'})
        break
      case 'workTime':
        firstOption = '在校生'
        year.unshift(firstOption)
        list.push(year)
        result = setResult()
        if (result !== 0) {
          list.push(this.data.month)
        } else {
          list.push([firstOption])
        }
        this.setData({list, year, result, mode: 'multiSelector', firstOption, placeholder: '请选择时间'})
        break
      case 'dateTime':
        result = []
        result[0] = year.indexOf(this.data.setResult.slice(0, 5))
        result[1] = this.data.month.indexOf(this.data.setResult.slice(5, 8))
        if (result[0] === -1) result[0] = 0
        if (result[1] === -1) result[1] = 0
        let days = this.getThisMonthDays(parseInt(year[result[0]]), parseInt(this.data.month[result[1]]))
        result[2] = days.indexOf(this.data.setResult.slice(8, 11))
        result[3] = this.data.hours.indexOf(this.data.setResult.slice(12, 14))
        result[4] = this.data.minutes.indexOf(this.data.setResult.slice(15, 17))
        if (result[2] === -1) result = 0 // 开启palceholder
        list.push(year)
        list.push(this.data.month)
        list.push(days)
        list.push(this.data.hours)
        list.push(this.data.minutes)
        this.setData({list, year, days, result, mode: 'multiSelector', placeholder: '请选择面试时间'})
        break
      case 'education':
        list = this.data.education
        result = `${list.indexOf(this.data.setResult)}`
        if (result === `-1`) { result = 0 }
        this.setData({list, result, mode: 'selector', placeholder: '请选择学历'})
        break
      case 'sex':
        list = this.data.sex
        result = `${list.indexOf(this.data.setResult)}`
        if (result === `-1`) { result = 0 }
        this.setData({list, result, mode: 'selector', placeholder: '请选择性别'})
        break
      case 'jobStatus':
        list = this.data.jobStatus
        result = `${list.indexOf(this.data.setResult)}`
        if (result === `-1`) { result = 0 }
        this.setData({list, result, mode: 'selector', placeholder: '请选择求职状态'})
        break
      case 'experience':
        list = this.data.experience
        result = `${list.indexOf(this.data.setResult)}`
        if (result === `-1`) { result = 0 }
        this.setData({list, result, mode: 'selector', placeholder: '请选择经验要求'})
        break
      case 'staffMembers':
        list = this.data.staffMembers
        result = `${list.indexOf(this.data.setResult)}`
        if (result === `-1`) { result = 0 }
        this.setData({list, result, mode: 'selector', placeholder: '请选择人员规模'})
        break
      case 'financing':
        list = this.data.financing
        result = `${list.indexOf(this.data.setResult)}`
        if (result === `-1`) { result = 0 }
        this.setData({list, result, mode: 'selector', placeholder: '请选择融资情况'})
        break
      case 'salaryRangeC':
        let startNum = []
        let endNum = []
        for (let i = 1; i <= 60; i++) {
          startNum.push(`${i}k`)
        }
        result = []
        result[0] = startNum.indexOf(this.data.setResult.split('~')[0])
        if (result[0] === -1) result[0] = 0
        for (let i = parseInt(startNum[result[0]]) + 1; i <= parseInt(startNum[result[0]]) * 2; i++) {
          endNum.push(`${i}k`)
        }
        result[1] = endNum.indexOf(this.data.setResult.split('~')[1])
        if (result[1] === -1) result = 0
        list = [startNum, endNum]
        this.setData({list, result, mode: 'multiSelector', placeholder: '请选择期望薪'})
        break
      case 'salaryRangeB':
        console.log(this.data.setResult)
        let startNumB = []
        let endNumB = []
        for (let i = 1; i <= 29; i++) {
          startNumB.push(`${i}k`)
        }
        for (let i = 30; i <= 95; i+=5) {
          startNumB.push(`${i}k`)
        }
        for (let i = 100; i <= 260; i+=10) {
          startNumB.push(`${i}k`)
        }
        result = []
        result[0] = startNumB.indexOf(this.data.setResult.split('~')[0])
        if (result[0] === -1) result[0] = 0
        for (let i = parseInt(startNumB[result[0]]) + 1; i <= parseInt(startNumB[result[0]]) + 5; i++) {
          if (i <= 260) {
            endNumB.push(`${i}k`)
          }
        }
        result[1] = endNumB.indexOf(this.data.setResult.split('~')[1])
        if (result[1] === -1) result = 0
        list = [startNumB, endNumB]
        this.setData({list, result, mode: 'multiSelector', placeholder: '请选择期望薪'})
        break
      case 'occupation':
        getJobLabelApi({type: 'skills'}).then(res => {
          list = res.data.labelProfessionalSkills
          let propsResult = null
          list.map((item, index) => {
            if (item.name === this.data.setResult) {
              result = `${index}`
              propsResult = item
            }
          })
          console.log(propsResult)
          this.triggerEvent('resultevent', {propsResult})
          this.setData({list, result, mode: 'selector', placeholder: '请选择职业'})
        })
        break
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 封装返回给父组件的数据
    setResult() {
      let propsResult = ''
      let propsDesc = ''
      let list = this.data.list
      let result = this.data.result
      if (this.data.mode === 'multiSelector') {
        if (this.data.dateType.indexOf(this.data.pickerType) !== -1) {
          if (this.data.pickerType === 'dateTime') {
            propsDesc = `${list[0][result[0]]}-${list[1][result[1]]}-${list[2][result[2]]} ${list[3][result[3]]}:${list[4][result[4]]}`
            propsResult = new Date(propsDesc).getTime() / 1000
          } else {
            if ((this.data.pickerType === 'endTime' && this.data.result[0] === 0) || (this.data.pickerType === 'workTime' && this.data.result[0] === 0)) {
              propsResult = 0
              propsDesc = list[0][0]
            } else {
              propsDesc = `${list[0][result[0]]}-${list[1][result[1]]}`
              propsResult = new Date(propsDesc).getTime() / 1000
            }
          }
        } else if (this.data.pickerType === 'salaryRangeB' || this.data.pickerType === 'salaryRangeC') {
          propsResult = [list[0][result[0]], list[1][result[1]]]
          propsDesc = `${list[0][result[0]]}~${list[1][result[1]]}`
        }
      } else {
        if (this.data.pickerType === 'occupation') {
          propsResult = list[parseInt(result)]
        } else {
          propsResult = list[result].value
          propsDesc = list[result].name
        }
      }
      this.triggerEvent('resultevent', {propsResult, propsDesc})
    },
    // picker 变动监听
    change(e) {
      if (this.data.mode === 'multiSelector' && e.detail.value[1] === null) {
        e.detail.value[1] = 0
      }
      this.setData({result: e.detail.value})
      this.setResult()
    },
    // picker 某一项数据滚动监听
    changeColumn(e) {
      if (this.data.mode !== 'multiSelector') return
      let list = []
      const changeData = (year, month) => {
        list = this.data.list
        list[2] = this.getThisMonthDays(parseInt(year), parseInt(month))
        this.setData({list})
      }
      if (this.data.pickerType === 'dateTime') {
        let result = this.data.result
        if (this.data.result === 0) {
          result = [0, 0, 0, 0, 0]
        }
        let year = this.data.year[result[0]]
        let month = this.data.month[result[1]]
        if (e.detail.column === 0) { // 选择份
          year = this.data.year[e.detail.value]
          changeData(year, month)
        } else if (e.detail.column === 1) { // 选择份
          month = this.data.month[e.detail.value]
          changeData(year, month)
        }
      } else {
        // 有自定义选型的
        if (this.data.firstOption) {
          list.push(this.data.year)
          // 滑动第一项的时候
          if (e.detail.column === 0) {
            if (e.detail.value === 0) {
              list.push([this.data.firstOption])
            } else {
              list.push(this.data.month)
            }
            this.setData({list})
          }
        }
        if (this.data.pickerType === 'salaryRangeC') {
          if (e.detail.column === 0) { // 选择起始工资
            list = this.data.list
            let startNum = list[0][e.detail.value]
            let endNum = []
            for (let i = parseInt(startNum) + 1; i <= parseInt(startNum) * 2; i++) {
              endNum.push(`${i}k`)
            }
            list[1] = endNum
            this.setData({list})
          }
        }
        if (this.data.pickerType === 'salaryRangeB') {
          if (e.detail.column === 0) { // 选择起始工资
            list = this.data.list
            let startNum = list[0][e.detail.value]
            let endNum = []
            for (let i = parseInt(startNum) + 1; i <= parseInt(startNum) + 5; i++) {
              endNum.push(`${i}k`)
            }
            list[1] = endNum
            this.setData({list})
          }
        }
      }
    },
    // 获取某某的天数
    getThisMonthDays(year, month) {
      let dayNum = new Date(year, month, 0).getDate()
      let days = []
      for (let i = 1; i < dayNum + 1; i++) {
        if (i < 10) {
          days.push(`0${i}`)
        } else {
          days.push(`${i}`)
        }
      }
      return days
    }
  }
})
