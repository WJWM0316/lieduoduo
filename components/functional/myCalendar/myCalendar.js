// components/business/myCalendar/myCalendar.js
import {getSelectorQuery}  from '../../../utils/util.js'
let isLoadData = false  // 由于setData是异步的需要加个锁来控制
let itemWidth = 0 // 计算单个item的宽度
let nextMonth = 0 // 下个月份保存
let prevMonth = 0 // 上个月份保存
let nextYear = 0 // 下个年份保存
let prevYear = 0 // 上个年份保存
Component({
  externalClasses: ['myCalendar'],
  /**
   * 组件的属性列表
   */
  properties: {
    setDateList: {
      type: Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    scrollLeft: 0,
    weeks_ch: ['日', '一', '二', '三', '四', '五', '六'],
    date: new Date(),
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    list: []
  },
  attached () {
    let systemInfo = getApp().globalData.systemInfo
    let list = this.getThisMonthDays(this.data.year, this.data.month)
    itemWidth = 0.14285 * systemInfo.windowWidth
    let scrollLeft = itemWidth * (this.data.day - 3)
    this.setData({list, scrollLeft})
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 下个月
    nextMonth () {
      if (!nextMonth) {
        nextMonth = this.data.month
      }
      if (!nextYear) {
        nextYear = this.data.year
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
        prevMonth = this.data.month
      }
      if (!prevYear) {
        prevYear = this.data.year
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
      let firstDatWeek = this.getFirstDayOfWeek(year, month)
      let thisMonthlist = [{'month': month}]
      let list = this.data.list
      for(let i = 1; i < dayNum + 1; i++) {
        let obj = {
          year,
          month,
          day: i,
          date: `${year}年${month}月${i}日`
        }
        obj.week = this.data.weeks_ch[firstDatWeek]
        firstDatWeek++
        if (firstDatWeek > 6) {
          firstDatWeek = 0
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
