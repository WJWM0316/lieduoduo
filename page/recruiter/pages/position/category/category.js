import { getLabelPositionApi } from '../../../../../api/pages/label.js'

import {RECRUITER} from '../../../../../config.js'

Page({
  data: {
    positionTypeList: [],
    query: ''
  },
  onLoad(options) {
    console.log(options)
    getLabelPositionApi()
      .then(res => {
        this.setData({positionTypeList: res.data, query: options})
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-25
   * @detail   选择职业类别
   * @return   {[type]}     [description]
   */
  onClick(e) {
    const params = e.currentTarget.dataset
    const result = this.data.positionTypeList.find(field => field.labelId === parseInt(params.labelId))
    wx.navigateTo({url: `${RECRUITER}position/post/post?type=${result.labelId}&typeName=${result.name}`})
  }
})