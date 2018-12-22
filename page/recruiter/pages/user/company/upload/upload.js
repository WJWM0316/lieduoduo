Page({
  data: {
    business_license: {
      smallUrl: ''
    },
    on_job: {
      smallUrl: ''
    },
    canClick: false,
    formData: {
      real_name: '',
      user_email: '',
      user_position: '',
      company_name: '',
      company_shortname: '',
      industry_id: '',
      financing: '',
      logo: '',
      employees: '',
      business_license: '',
      on_job: '',
      email: '',
      website: '',
      intro: ''
    }
  },
  onLoad() {
    getApp().globalData.identity = 'RECRUITER'
    this.init()
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-21
   * @detail   初始化页面
   * @return   {[type]}   [description]
   */
  init() {
    this.getCreateParams()
    wx.getStorage({
      key: 'uploadCompanyImages',
      success: res => {
        const params = ['canClick', 'business_license', 'on_job']
        params.map(field => this.setData({ [field]: res.data[field]}))
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-21
   * @detail   图片上传
   * @return   {[type]}     [description]
   */
  upload(e) {
    const key = e.currentTarget.dataset.type
    this.setData({ [key]: e.detail[0] })
    this.bindBtnStatus()
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-20
   * @detail   绑定按钮的状态
   * @return   {[type]}   [description]
   */
  bindBtnStatus() {
    const canClick = this.data.business_license.smallUrl && this.data.on_job.smallUrl ? true : false
    this.setData({ canClick })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-21
   * @detail   保存当前页面的编辑数据
   * @return   {[type]}   [description]
   */
  saveFormData() {
    const data = this.data
    delete data.formData
    wx.setStorage({
      key: 'uploadCompanyImages',
      data
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-21
   * @detail   获取创建公司的所有参数
   * @return   {[type]}   [description]
   */
  getCreateParams() {
    // 第一步
    wx.getStorage({
      key: 'createdCompanyBase',
      success: res => {
        const params = ['real_name', 'user_email', 'user_position']
        const formData = this.data.formData
        params.map(field => formData[field] = res.data[field])
        this.setData({ formData })
      }
    })
    // 第二步
    wx.getStorage({
      key: 'createdCompanyName',
      success: res => {
        const params = ['company_name']
        const formData = this.data.formData
        params.map(field => formData[field] = res.data[field])
        this.setData({ formData })
      }
    })
    // 第三步
    wx.getStorage({
      key: 'createdCompanyName',
      success: res => {
        const params = ['company_name']
        const formData = this.data.formData
        params.map(field => formData[field] = res.data[field])
        this.setData({ formData })
      }
    })
    // 第四步
    wx.getStorage({
      key: 'createCompanyInfos',
      success: res => {
        const params = [
          'industry_id',
          'financing',
          'employees'
        ]
        const formData = this.data.formData
        params.map(field => formData[field] = res.data[field])
        this.setData({ formData })
      }
    })
    // 第五步
    wx.getStorage({
      key: 'createCompanyInfos',
      success: res => {
        const params = [
          'industry_id',
          'financing',
          'employees'
        ]
        const formData = this.data.formData
        params.map(field => formData[field] = res.data[field])
        this.setData({ formData })
      }
    })
    // 第六步
    wx.getStorage({
      key: 'createCompanyIntro',
      success: res => {
        const params = ['intro']
        const formData = this.data.formData
        params.map(field => formData[field] = res.data[field])
        this.setData({ formData })
      }
    })
  },
  submit() {
    if(!this.data.canClick) return;
    this.saveFormData()
  }
})