// components/layout/myPicker/myPicker.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pickerType: {
      type: String,
      value: ''
    },
    mode: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    result: 0,
    list: [],
    year: [],
    firstOption: null,
    placeholder: null,
    financing: ['未融资', '天使轮', 'A轮', 'B轮', 'C轮', 'D轮及以上', '已上市', '不需要融资'],
    staffMembers: ['0-20人', '20-99人', '100-499人', '500-999人', '1000人-9999人', '10000人以上'],
    experience: ['不限', '应届生', '1年以内', '1-3年', '3-5年', '5-10年', '10年以上'],
    jobStatus: ['离职，随时到岗', '在职，暂不考虑', '在职，考虑机会', '在职，月内到岗'],
    education: ['博士', '硕士', '本科', '大专', '中专/中技', '高中', '初中及以下'],
    sex: ['男', '女'],
    month: ['12月', '11月', '10月', '09月', '08月', '07月', '06月', '05月','04月', '03月', '02月', '01月'],
    days: ['01日', '02日', '03日', '04日', '05日', '06日', '07日', '08日', '09日', '10日', '11日', '12日', '13日', '14日', '15日', '16日', '17日', '18日', '19日', '20日', '21日', '22日', '23日', '24日', '25日', '26日', '27日', '28日', '29日', '30日'],
    hours: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
    minutes: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']
  },
  attached: function () {
    let list = []
    let curYear = new Date().getFullYear()
    let curMonth = new Date().getMonth() + 1
    let year = []
    for (let i = 0; i < 65; i++) {
      year.push(`${curYear}年`)
      curYear--
    }
    switch (this.data.pickerType) {
      case 'startTime':
        this.setData({mode: 'multiSelector', placeholder: '请选择开始时间'})
        list.push(year)
        list.push(this.data.month)
        break
      case 'endTime':
        this.setData({mode: 'multiSelector', firstOption: '至今', placeholder: '请选择结束时间'})
        year.unshift(this.data.firstOption)
        list.push(year)
        list.push(this.data.month)
        break
      case 'workTime':
        this.setData({mode: 'multiSelector', firstOption: '在校生', placeholder: '请选择参加工作时间'})
        year.unshift(this.data.firstOption)
        list.push(year)
        list.push(this.data.month)
        break
      case 'dateTime':
        this.setData({mode: 'multiSelector', placeholder: '请选择面试时间'})
        let result = this.data.result || [0, 0, 0, 0, 0]
        this.getThisMonthDays(parseInt(year[result[0]]), parseInt(this.data.month[result[1]]))
        list.push(year)
        list.push(this.data.month)
        list.push(this.data.days)
        list.push(this.data.hours)
        list.push(this.data.minutes)
        break
      case 'education':
        list = this.data.education
        this.setData({mode: 'selector', placeholder: '请选择学历'})
        break
      case 'sex':
        list = this.data.sex
        this.setData({mode: 'selector', placeholder: '请选择性别'})
        break
      case 'jobStatus':
        list = this.data.jobStatus
        this.setData({mode: 'selector', placeholder: '请选择求职状态'})
        break
      case 'experience':
        list = this.data.experience
        this.setData({mode: 'selector', placeholder: '请选择经验要求'})
        break
      case 'staffMembers':
        list = this.data.staffMembers
        this.setData({mode: 'selector', placeholder: '请选择人员规模'})
        break
      case 'financing':
        list = this.data.financing
        this.setData({mode: 'selector', placeholder: '请选择融资情况'})
        break
    }
    this.setData({list, year})
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
        if (this.data.pickerType === 'dateTime') {
          propsDesc = `${parseInt(list[0][result[0]])}-${parseInt(list[1][result[1]])}-${parseInt(list[2][result[2]])} ${list[3][result[3]]}:${list[4][result[4]]}`
          propsResult = new Date(propsDesc).getTime() / 1000
        } else {
          if ((this.data.pickerType === 'endTime' && this.data.result[0] === 0) || (this.data.pickerType === 'workTime' && this.data.result[0] === 0)) {
            propsResult = list[0][0]
            propsDesc = list[0][0]
          } else {
            propsDesc = `${parseInt(list[0][result[0]])}-${parseInt(list[1][result[1]])}`
            propsResult = new Date(propsDesc).getTime() / 1000
          }
        }
      } else {
        if (this.data.pickerType === 'education') {
          propsResult = list[result]
          propsDesc = result
        } else if (this.data.pickerType === 'sex') {
          propsResult = list[result]
          if (result === 0) {
            propsDesc = 1
          } else {
            propsDesc = 2
          }
        } 
      }
      this.triggerEvent('resultevent', {propsResult, propsDesc})
    },
    // 点击placeholder要处理的事情
    setPlaceholder() {
      if (this.data.mode === 'multiSelector') {
        if (this.data.pickerType === 'dateTime') {
          this.setData({result: [0, 0, 0, 0, 0]})
        } else {
          this.setData({result: [0, 0]})
        }
        if (this.data.firstOption) {
          let list = this.data.list
          list[1] = [this.data.firstOption]
          this.setData({list})
        }
      } else {
        this.setData({result: '0'})
      }
      this.setResult()
    },
    // picker 变动监听
    change(e) {
      this.setData({result: e.detail.value})
      this.setResult()
    },
    // picker 某一项数据滚动监听
    changeColumn(e) {
      if (this.data.mode !== 'multiSelector') return
      let list = []
      const changeData = (year, month) => {
        this.getThisMonthDays(parseInt(year), parseInt(month))
        list.push(this.data.year)
        list.push(this.data.month)
        list.push(this.data.days)
        list.push(this.data.hours)
        list.push(this.data.minutes)
        this.setData({list})
      }
      if (this.data.pickerType === 'dateTime') {
        let result = this.data.result
        let year = this.data.year[result[0]]
        let month = this.data.month[result[1]]
        if (e.detail.column === 0) { // 选择年份
          year = this.data.year[e.detail.value]
          changeData(year, month)
        } else if (e.detail.column === 1) { // 选择月份
          month = this.data.month[e.detail.value]
          changeData(year, month)
        }
      } else {
        // 滑动第一项的时候
        if (e.detail.column === 0) {
          list.push(this.data.year)
          if (e.detail.value === 0) {
            list.push([this.data.firstOption])
          } else {
            list.push(this.data.month)
          }
          this.setData({list})
        }
      }
    },
    // 获取某年某月的天数
    getThisMonthDays: function(year, month) {
      let dayNum = new Date(year, month, 0).getDate()
      let days = []
      for (let i = 1; i < dayNum + 1; i++) {
        if (i < 10) {
          days.push(`0${i}日`)
        } else {
          days.push(`${i}日`)
        }
      }
      this.setData({days})
    }
  }
})
