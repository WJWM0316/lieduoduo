// components/business/myCalendar/myCalendar.js
import {getSelectorQuery}  from '../../../utils/util.js'
Component({
  externalClasses: ['myCalendar'],
  /**
   * 组件的属性列表
   */
  properties: {

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
    list: [],
    query: wx.createSelectorQuery()
  },
  attached () {
    this.getThisMonthDays(this.data.year, this.data.month)
  },
  ready () {
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 下个月
    nextMonth () {
      console.log('下个月')
      let month = this.data.month
      let year = this.data.year
      month++
      if (month > 12) {
        month = 0
        year++
      }
      this.setData({
        year,
        month
      })
      this.getThisMonthDays(this.data.year, this.data.month, 'seq')
    },
    // 上个月
    prevMonth () {
      let month = this.data.month
      let year = this.data.year
      month--
      if (month < 0) {
        month = 12
        year--
      }
      this.setData({
        year,
        month
      })
      this.getThisMonthDays(this.data.year, this.data.month, 'ord')

      setTimeout(() => {
        getSelectorQuery(".myCalendar >>> .wrap > .last").then(res => {
          this.setData({
            scrollLeft: res.left + res.width
          })
        })
      }, 300)
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
      let thisMonthlist = []
      let list = this.data.list
      for(let i = 1; i < dayNum + 1; i++) {
        let obj = {
          year,
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
      this.setData({list})
      setTimeout(() => {
        getSelectorQuery(".wrap")
      }, 1000)
    },
    // 获取当月第一天星期几
    getFirstDayOfWeek: function(year, month) {
      return new Date(Date.UTC(year, month - 1, 1)).getDay();
    }
  }
})
