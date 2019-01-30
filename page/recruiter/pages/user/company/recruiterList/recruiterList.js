import {
  getRecruitersListApi
} from '../../../../../../api/pages/company.js'

import {RECRUITER, COMMON} from '../../../../../../config.js'

Page({
  data: {
    recruitersList: []
  },
  onLoad(options) {
    this.getRecruitersList(options)
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-04
   * @detail   获取招聘团队
   * @return   {[type]}   [description]
   */
  getRecruitersList(options) {
    getRecruitersListApi({id: options.companyId}).then(res => {
      this.setData({recruitersList: res.data})
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-15
   * @detail   查看招聘管主页
   * @return   {[type]}     [description]
   */
  bindMain(e) {
    const params = e.currentTarget.dataset
    wx.navigateTo({
      url: `${COMMON}recruiterDetail/recruiterDetail?uid=${params.uid}`
    })
  }
})