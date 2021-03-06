import {putCompanyInfoApi} from '../../../../../api/pages/company.js'
let app = getApp()
Page({
  data: {
    info: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let info = app.globalData.companyInfo
    this.setData({info})
  },
  changeVal(e) {
    let info = this.data.info
    info.website = e.detail.value
    this.setData({info})
  },
  getResult(e) {
    let info = this.data.info
    switch(e.currentTarget.dataset.type) {
      case 'financing':
        info.financing = e.detail.propsResult
        info.financingInfo = e.detail.propsDesc
        break
      case 'staffMembers':
        info.employees = e.detail.propsResult
        info.employeesInfo = e.detail.propsDesc
        break
      case 'avatar':
        info.logoInfo = e.detail[0]
        break
    }
    this.setData({info})
  },
  disabled() {
    app.wxToast({title: '已认证不可修改'})
  },
  saveInfo() {
    let info = this.data.info
    let data = {
      id: info.id,
      financing: info.financing,
      employees: info.employees,
      logo: info.logoInfo.id,
      website: info.website
    }
    putCompanyInfoApi(data).then(res => {
      app.wxToast({
        title: '保存成功',
        icon: "success",
        callback() {
          app.globalData.companyInfo = info
          wx.navigateBack({
            delta: 1
          })
        }
      })
    })
  }
})