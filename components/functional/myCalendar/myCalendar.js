// components/business/myCalendar/myCalendar.js
import {getSelectorQuery}  from '../../../utils/util.js'
let isLoadData = false  // 由于setData是异步的需要加个锁来控制
let itemWidth = 0 // 计算单个item的宽度
let nextMonth = 0 // 下个月份保存
let prevMonth = 0 // 上个月份保存
let nextYear = 0 // 下个年份保存
let prevYear = 0 // 上个年份保存
let curYear = new Date().getFullYear()
let curMonth = new Date().getMonth() + 1
let curDay = new Date().getDate()
let firstWeek = 0
let toggleYear = curYear
let toggleMonth = curMonth
if (curDay < 10) {
  curDay = `0${curDay}`
}
Component({
  externalClasses: ['myCalendar', 'jidian'],
  /**
   * 组件的属性列表
   */
  properties: {
    setDateList: {
      type: Array
    },
    calendarType: {
      type: String,
      value: 'normal' // normal 标准日历 ， roll 横向滚动日历,  
    },
    switchable: { // 两种日历是否可切换
      type: Boolean
    },
    isClick: { // 是否可以点击日期
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    scrollLeft: 0,
    curDate: `${curYear}年${curMonth}月${curDay}日`,
    weeks_ch: ['日', '一', '二', '三', '四', '五', '六'],
    choseDate: null,
    list: [],
    calendarBody: [],
    headYear: curYear,
    headMonth: curMonth,
  },
  attached () {
    let list = this.getThisMonthDays(curYear, curMonth)
    let systemInfo = getApp().globalData.systemInfo
    itemWidth = 0.14285 * systemInfo.windowWidth
    let scrollLeft = itemWidth * (curDay - 3)
    if (this.data.switchable || this.data.calendarType === 'roll') {
      this.setData({list, scrollLeft, choseDate: this.data.curDate})
    } else {
      this.setData({choseDate: this.data.curDate})
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    toggle (e) {
      if (!this.data.isClick) return
      let { year, month, days } = e.currentTarget.dataset
      let choseDate = `${year}年${month}月${days}日`
      this.setData({choseDate})
      this.triggerEvent('resultEvent', {year, month, days})
    },
    changeType () {
      if (this.data.calendarType === 'roll') {
        this.setData({
          calendarType: 'normal'
        })
      } else if (this.data.calendarType === 'normal') {
        this.setData({
          calendarType: 'roll'
        })
      }
    },
    // 下个月
    nextMonth () {
      if (this.data.calendarType === 'roll') {
        if (!nextMonth) {
          nextMonth = curMonth
        }
        if (!nextYear) {
          nextYear = curYear
        }
        nextMonth++
        if (nextMonth > 12) {
          nextMonth = 1
          nextYear++
        }
        let list = this.getThisMonthDays(nextYear, nextMonth, 'seq')
        this.setData({list})
      } else {
        toggleMonth++
        if (toggleMonth > 12) {
          toggleMonth = 1
          toggleYear++
        }
        this.getThisMonthDays(toggleYear, toggleMonth, 'seq')
        this.setData({headYear: toggleYear, headMonth: toggleMonth})
      }
    },
    // 上个月
    prevMonth () {
      if (this.data.calendarType === 'roll') {
        if (isLoadData) return
        isLoadData = true
        if (!prevMonth) {
          prevMonth = curMonth
        }
        if (!prevYear) {
          prevYear = curYear
        }
        prevMonth--
        if (prevMonth === 0) {
          prevMonth = 12
          prevYear--
        }
        let scrollLeft = itemWidth * 28
        let list = this.getThisMonthDays(prevYear, prevMonth, 'ord')
        this.setData({list, scrollLeft}, function() {
          isLoadData = false
        })
      } else {
        toggleMonth--
        if (toggleMonth === 0) {
          toggleMonth = 12
          toggleYear--
        }
        this.getThisMonthDays(toggleYear, toggleMonth, 'ord')
        this.setData({headYear: toggleYear, headMonth: toggleMonth})
      }
    },
    // 获取当月共多少天
    getThisMonthDays (year, month, sort) {
      let dayNum = new Date(year, month, 0).getDate()
      let firstDayWeek = this.getFirstDayOfWeek(year, month)
      firstWeek = firstDayWeek
      let thisMonthlist = [{'month': month}]
      let list = this.data.list
      for(let i = 1; i < dayNum + 1; i++) {
        let j = i
        if (j < 10) {
          j = `0${j}`
        }
        let obj = {
          year,
          month,
          day: i,
          days: j,
          date: `${year}年${month}月${j}日`
        }
        obj.week = this.data.weeks_ch[firstDayWeek]
        // 标注面试时间
        if (this.data.setDateList.indexOf(obj.date) !== -1) {
          obj.haveView = true
          // 已过期的面试时间
          let curTime = `${curYear}/${curMonth}/${curDay}`
          let objTime = `${obj.year}/${obj.month}/${obj.days}`
          if (new Date(curTime).getTime() > new Date(objTime).getTime()) {
            obj.haveViewed = true
          }
        }
        firstDayWeek++
        if (firstDayWeek > 6) {
          firstDayWeek = 0
        }
        thisMonthlist.push(obj)
      }
      // 只有nolmal 格式才需要执行
      if (this.data.switchable || this.data.calendarType === 'normal') {
        let calendarBody = thisMonthlist.slice(1)
        for (let i = 0; i < firstWeek; i++) {
          calendarBody.unshift('')
        }
        this.setData({calendarBody})
      }
      if (sort === 'seq') {
        list = list.concat(thisMonthlist)
      } else {
        list = thisMonthlist.concat(list)
      }
      return list
    },
    // 获取当月第一天星期几
    getFirstDayOfWeek (year, month) {
      return new Date(Date.UTC(year, month - 1, 1)).getDay();
    }
  }
})
