// components/business/myCalendar/myCalendar.js
import {getSelectorQuery}  from '../../../utils/util.js'
let isLoadData = false  // 由于setData是异步的需要加个锁来控制
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
    curScrollLeft: 0,
    weeks_ch: ['日', '一', '二', '三', '四', '五', '六'],
    date: new Date(),
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    nextMonth: 0,
    prevMonth: 0,
    nextYear: 0,
    prevYear: 0,
    list: [],
    query: wx.createSelectorQuery(),
    itemWidth: 0
  },
  attached () {
    let list = this.getThisMonthDays(this.data.year, this.data.month)
    console.log(this.data.month, this.data.day)
    this.setData({list}, function() {
      getSelectorQuery(".myCalendar >>> .wrap >>> .last").then(res => {
        let scrollLeft = res.width * (this.data.day - 2)
        this.setData({
          itemWidth: res.width,
          scrollLeft
        })
        console.log(res)
      })
    })
    
  },
  ready () {
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 下个月
    nextMonth () {
      let nextMonth = this.data.nextMonth
      if (!nextMonth) {
        nextMonth = this.data.month
      }
      let nextYear = this.data.nextYear
      if (!nextYear) {
        nextYear = this.data.year
      }
      nextMonth++
      if (nextMonth > 12) {
        nextMonth = 1
        nextYear++
      }
      console.log('下个月', this.data.nextMonth)
      let list = this.getThisMonthDays(nextYear, nextMonth, 'seq')
      this.setData({list, nextYear, nextMonth})
    },
    // 上个月
    prevMonth () {
      if (isLoadData) return
      isLoadData = true
      let prevMonth = this.data.prevMonth
      if (!prevMonth) {
        prevMonth = this.data.month
      }
      let prevYear = this.data.prevYear
      if (!prevYear) {
        prevYear = this.data.year
      }
      prevMonth--
      if (prevMonth < 0) {
        prevMonth = 12
        prevYear--
      }
      let scrollLeft = this.data.itemWidth * 28
      console.log('上个月', this.data.prevMonth, scrollLeft)
      let list = this.getThisMonthDays(prevYear, prevMonth, 'ord')
      this.setData({list, prevYear, prevMonth}, function() {
        this.setData({scrollLeft})
        isLoadData = false
      })
    },
    scroll (e) {
      this.setData({
        curScrollLeft: e.detail.scrollLeft
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
