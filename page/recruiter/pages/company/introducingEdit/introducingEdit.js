import {
  putCompanyBriefApi, 
  getCompanyInfosApi
} from '../../../../../api/pages/company.js'

let app = getApp()

Page({
  data: {
    intro: ''
  },
  onLoad(options) {
    this.getCompanyDetail(options)
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-11
   * @detail   防抖
   * @return   {[type]}   [description]
   */
  debounce(fn, context, delay, text) {
    clearTimeout(fn.timeoutId)
    fn.timeoutId = setTimeout(() => fn.call(context, text), delay)
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-02
   * @detail   获取公司详情
   * @return   {[type]}   [description]
   */
  getCompanyDetail(options) {
    getCompanyInfosApi({id: options.companyId}).then(res => {
      const intro = res.data.intro.replace(/\\n/g, '\n')
      this.setData({intro, options})
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-19
   * @detail   绑定用户输入
   * @return   {[type]}     [description]
   */
  bindInput(e) {
    const name = e.detail.value
    this.debounce(this.bindChange, null, 500, name)
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-19
   * @detail   绑定值得改变
   * @return   {[type]}        [description]
   */
  bindChange(intro) {
    this.setData({intro})
  },
  submit() {
    let id = this.data.options.companyId
    let intro = this.data.intro
    putCompanyBriefApi({id, intro}).then(res => {
      app.wxToast({title: '保存成功'})
      wx.navigateBack({delta: 1})
    })
  }
})