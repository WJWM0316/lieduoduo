import {
  getAdApi,
  touchVkeyApi
} from '../../../api/pages/common.js'

import {
  recruiterList,
  applicantList
} from '../../../utils/navigation.js'

import {getAdBannerApi} from '../../../api/pages/common'
const getdate = () => {
  let date = new Date()
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  return date
}

const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    showPop: false,
    adData: {},
    timestamp: 0
  },
  attached () {
    this.setData({timestamp: Date.parse(getdate()) + 24 * 60 * 60 * 1000 - 1})
    let item = applicantList.find(v => v.path.includes(app.getCurrentPagePath()))
    getAdBannerApi({location: 'miniProgram_c_index_find_opportunity'}).then(res => {
      if (res.data.length) {
        let adData = res.data[0]
        let ad = wx.getStorageSync('ad')
        let that = this
        if(adData.popupType === item.name) {
          if(ad) {
            // 当前时间大于缓存的时间
            if(Date.parse(new Date()) >= ad.expire_date) {
              wx.removeStorageSync('ad')
              this.setData({adData, showPop: adData.popupNum})
            } else {
              // 后台重新编辑弹窗次数
              if(adData.popupNum !== ad.popupNum) {
                wx.setStorageSync('ad', {
                  expire_date: that.data.timestamp,
                  leaveClickNum: adData.popupNum,
                  popupNum: adData.popupNum
                })
              }
              this.setData({adData, showPop: ad.leaveClickNum})
            }

          } else {
            this.setData({adData, showPop: adData.popupNum})
          }
        }
      } else {
        wx.removeStorageSync('ad')
      }
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    jump () {
      let adData = this.data.adData
      let url = adData.otherUrl || adData.targetUrl
      url = '/' + url
      wx.navigateTo({url })
      this.close()
    },
    close () {
      let that = this
      let adData = this.data.adData
      let popupNum = adData.popupNum
      let ad = wx.getStorageSync('ad')
      console.log(Date.parse(new Date()), '---', this.data.timestamp)
      popupNum--
      if(ad) {
        ad.leaveClickNum--
        wx.setStorageSync('ad', ad)
      } else {
        wx.setStorageSync('ad', {
          expire_date: that.data.timestamp,
          leaveClickNum: popupNum,
          popupNum: adData.popupNum
        })
      }
      this.setData({showPop: false})
    }
  }
})
