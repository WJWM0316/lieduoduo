const app = getApp()
import {COMMON, APPLICANT, DOWNLOADAPPPATH} from '../../../config.js'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: Number,
      value: 1
    },
    popDesc: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showPop: false,
    stg: app.globalData.stg,
    cdnImagePath: app.globalData.cdnImagePath
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close () {
      this.setData({showPop: false})
    },
    show () {
      this.setData({showPop: true})
    },
    toDo (e) {
      let url = ''
      switch (e.currentTarget.dataset.type) {
        case 'perfect':
          url = `${COMMON}resumeDetail/resumeDetail?uid=${app.globalData.resumeInfo.uid}`
          break
        case 'index':
          url = `${APPLICANT}index/index`
          break
        case 'specialJob':
          url = `${APPLICANT}specialJob/specialJob`
          break
        case 'downLoadApp':
          switch (e.currentTarget.dataset.pagetype) {
            case '4':
              url = `${DOWNLOADAPPPATH}${encodeURIComponent(`&pageType=4`)}`
              break
            case '5':
              url = `${DOWNLOADAPPPATH}${encodeURIComponent(`&pageType=5`)}`
              break
          }
          break
      }
      wx.navigateTo({url})
      this.close()
    }
  }
})
