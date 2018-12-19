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
      type: Array,
      value: ['2018年12月17日', '2018年12月16日', '2018年12月30日']
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
    calendarBody: []
  },
  attached () {
    console.log(this.data.setDateList)
    let systemInfo = getApp().globalData.systemInfo
    let list = this.getThisMonthDays(curYear, curMonth)
    let calendarBody = list.slice(1)
    for (let i = 0; i < firstWeek; i++) {
      calendarBody.unshift('')
    }
    // console.log(firstWeek, calendarBody)
    itemWidth = 0.14285 * systemInfo.windowWidth
    let scrollLeft = itemWidth * (curDay - 3)
    this.setData({list, scrollLeft, choseDate: this.data.curDate, calendarBody})
    console.log(this.data.calendarBody)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    toggle (e) {
      let { year, month, days } = e.currentTarget.dataset
      let choseDate = `${year}年${month}月${days}日`
      this.setData({choseDate})
      this.triggerEvent('resultEvent', {year, month, days})
    },
    // 下个月
    nextMonth () {
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
    },
    // 上个月
    prevMonth () {
      if (isLoadData) return
      isLoadData = true
      if (!prevMonth) {
        prevMonth = curMonth
      }
      if (!prevYear) {
        prevYear = curYear
      }
      prevMonth--
      if (prevMonth < 0) {
        prevMonth = 12
        prevYear--
      }
      let scrollLeft = itemWidth * 28
      let list = this.getThisMonthDays(prevYear, prevMonth, 'ord')
      this.setData({list, scrollLeft}, function() {
        isLoadData = false
      })
    },
    // 获取当月共多少天
    getThisMonthDays: function(year, month, sort) {
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
      if (sort === 'seq') {
        list = list.concat(thisMonthlist)
      } else {
        list = thisMonthlist.concat(list)
      }
      return list
    },
    // 获取当月第一天星期几
    getFirstDayOfWeek: function(year, month) {
      return new Date(Date.UTC(year, month - 1, 1)).getDay();
    }
  }
})
