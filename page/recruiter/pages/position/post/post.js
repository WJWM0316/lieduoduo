import {
  createPositionApi,
  editPositionApi,
  getPositionApi
} from '../../../../../api/pages/position.js'

import {
  applyInterviewApi
} from '../../../../../api/pages/interview.js'

import {
  RECRUITER,
  COMMON
} from '../../../../../config.js'

let app = getApp()
Page({
  data: {
    position_name: '',
    lng: '',
    lat: '',
    area_id: '',
    address: '',
    doorplate: '',
    address_id: '',
    type: '',
    typeName: '',
    labels: [],
    annualSalary: 12,
    emolument_min: '',
    emolument_max: '',
    emolument_range: '请选择薪资范围',
    work_experience: '',
    work_experience_name: '请选择经验要求',
    education: '25',
    educationName: '本科',
    describe: '',
    skills: [],
    query: {},
    pageTitle: '',
    canClick: false,
    showScanBox: false,
    options: {},
    isRequire: false
  },
  onLoad(options) {
    this.setData({pageTitle: options.positionId ? '编辑职位' : '发布职位', query: options})
  },
  onShow() {
    this.getUpdateInfos()
  },
  backEvent() {
    if(this.data.query.positionId) {
      app.wxConfirm({
        title: '放弃修改',
        content: '你编辑的职位尚未保存，确定放弃编辑吗？',
        cancelText: '放弃',
        confirmText: '继续编辑',
        cancelBack() {
          wx.removeStorageSync('createPosition')
          wx.navigateBack({delta: 1})
        }
      })
    } else {
      app.wxConfirm({
        title: '温馨提示',
        content: '离开当前页面，已填写的数据将会丢失，确认放弃发布吗？',
        cancelText: '放弃',
        confirmText: '继续编辑',
        cancelBack() {
          wx.removeStorageSync('createPosition')
          wx.navigateBack({delta: 1})
        }
      })
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-28
   * @detail   获取编辑页面的信息
   * @param    {[type]}   options [description]
   * @return   {[type]}           [description]
   */
  getUpdateInfos() {
    let options = this.data.query
    let storage = Object.assign(wx.getStorageSync('createPosition'))
    if(
      storage.position_name
      || storage.area_id
      || storage.type
      || storage.typeName
      || storage.emolument_min
      || storage.emolument_max
      || storage.doorplate
      || storage.address
      || storage.describe
      || storage.work_experience
      || storage.lat
      || storage.lng
      || storage.address_id
      || storage.parentType
      ) {
      Object.keys(storage).map(field => this.setData({[field]: storage[field]}))
      this.bindButtonStatus()
      return;
    }
    if(!this.data.query.positionId) {
      this.setData({isRequire: true})
      return
    }
    getPositionApi({id: options.positionId}).then(res => {
      let formData = {}
      let infos = res.data
      formData.position_name = storage.position_name || infos.positionName
      formData.area_id = storage.area_id || infos.areaId
      formData.type = storage.type || infos.type
      formData.typeName = storage.typeName || infos.typeName
      formData.emolument_min = storage.emolument_min || infos.emolumentMin
      formData.emolument_max = storage.emolument_max || infos.emolumentMax
      formData.emolument_range =  storage.emolument_range || `${formData.emolument_min}k~${formData.emolument_max}k`
      formData.doorplate = storage.doorplate || infos.doorplate
      formData.address = storage.address || infos.address
      formData.skills = storage.skills || infos.skillsLabel
      formData.describe = storage.describe || infos.describe
      formData.education = storage.education || infos.education
      formData.educationName = storage.educationName || infos.educationName
      formData.work_experience = storage.work_experience || infos.workExperience
      formData.annualSalary = storage.annualSalary || infos.annualSalary
      formData.work_experience_name = storage.work_experience_name || infos.workExperienceName
      formData.lng = storage.lng || infos.lng
      formData.lat = storage.lat || infos.lat
      formData.address_id = storage.address_id || infos.addressId
      formData.parentType = storage.parentType || infos.topPid
      Object.keys(formData).map(field => this.setData({[field]: formData[field]}))
      this.setData({isRequire: true})
      this.bindButtonStatus()
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-24
   * @detail   离开当前页面
   * @return   {[type]}     [description]
   */
  routeJump(e) {
    let route = e.currentTarget.dataset.route
    let url = this.data.query.positionId
      ? `${RECRUITER}position/${route}/${route}?positionId=${this.data.query.positionId}`
      : `${RECRUITER}position/${route}/${route}`

    if(route === 'skills' && !this.data.type) {
      app.wxToast({title: '请先选择职业类型别'})
    } else {
      wx.navigateTo({ url })
      wx.setStorageSync('createPosition', this.data)
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-24
   * @detail   离开当前页面
   * @return   {[type]}     [description]
   */
  getPositionAddress() {
    let url = this.data.query.positionId
      ? `${RECRUITER}position/addressList/addressList?positionId=${this.data.query.positionId}&type=position&selected=1`
      : `${RECRUITER}position/addressList/addressList?type=position&selected=1`
      
    wx.navigateTo({ url })
    wx.setStorageSync('createPosition', this.data)
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-24
   * @detail   离开当前页面
   * @return   {[type]}     [description]
   */
  getCategory() {
    let url = this.data.query.positionId
      ? `${COMMON}category/category?positionId=${this.data.query.positionId}`
      : `${COMMON}category/category`
      
    wx.navigateTo({ url })
    wx.setStorageSync('createPosition', this.data)
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-26
   * @detail   获取薪资范围
   * @return   {[type]}     [description]
   */
  getSalary(e) {
    this.setData({
      emolument_min: parseInt(e.detail.propsResult[0]),
      emolument_max: parseInt(e.detail.propsResult[1]),
      annualSalary: parseInt(e.detail.propsResult[2]),
      emolument_range: `${e.detail.propsResult[0]}~${e.detail.propsResult[1]}`
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-26
   * @detail   获取工作经验
   * @return   {[type]}     [description]
   */
  getExperience(e) {
    this.setData({work_experience: e.detail.propsResult, work_experience_name: e.detail.propsDesc})
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-26
   * @detail   获取教育经历
   * @return   {[type]}     [description]
   */
  getEducation(e) {
    this.setData({education: e.detail.propsResult, educationName: e.detail.propsDesc})
  },
  submit() {
    app.subscribeWechatMessage('updatePosition').then(() => {
      let formData = {}
      let labels = []
      let action = this.data.query.positionId ? 'editPositionApi' : 'createPositionApi'
      let params = [
        'position_name',
        'type',
        'area_id',
        'address',
        'labels',
        'doorplate',
        'emolument_min',
        'emolument_max',
        'annualSalary',
        'work_experience',
        'education',
        'describe',
        'lng',
        'lat',
        'address_id',
      ]
      
      params.map(field => formData[field] = this.data[field])
      formData['annual_salary'] = formData.annualSalary
      this.data.skills.map((field, index) => labels.push({id: field.labelId, is_diy: 0}))
      formData.labels = JSON.stringify(labels)
      if(this.data.query.positionId) formData.id = this.data.query.positionId
      if(this.data.address_id) {
        delete formData.lng
        delete formData.lng
        delete formData.lat
        delete formData.area_id
        delete formData.address
        delete formData.doorplate
      } else {
        delete formData.address_id
      }

      // 验证职位名称是否已经完善
      let positionName = new Promise((resolve, reject) => {
        !this.data.position_name ? reject('请填写职位名称') : resolve()
      })

      // 验证职位类型是否已经选择
      let positionType = new Promise((resolve, reject) => {
        !this.data.type ? reject('请选择职位类别') : resolve()
      })

      let positionSkills = new Promise((resolve, reject) => {
        !this.data.skills.length ? reject('请选择技能要求') : resolve()
      })

      // 验证地址是否已经选择
      let positionAddress = new Promise((resolve, reject) => {
        !this.data.address_id ? reject('请选择地址') : resolve()
      })

      // 验证技能是否已经选择
      // let positionSkills = new Promise((resolve, reject) => {
      //   !this.data.skills.length ? reject('请选择技能要求') : resolve()
      // })

      // 验证薪资是否已经选择
      let positionEmolument = new Promise((resolve, reject) => {
        !this.data.emolument_min ? reject('请选择薪资范围') : resolve()
      })

      // 验证经验是否已经选择
      let positionExperience = new Promise((resolve, reject) => {
        !this.data.work_experience ? reject('请选择经验要求') : resolve()
      })

      // 验证学历是否已经选择
      let positionEducation = new Promise((resolve, reject) => {
        !this.data.education ? reject('请选择学历要求') : resolve()
      })

      // 验证职位描述是否已经完善
      let positionDescribe = new Promise((resolve, reject) => {
        !this.data.describe ? reject('请填写职位描述') : resolve()
      })

      Promise.all([
        positionName, 
        positionType, 
        positionAddress,
        // positionSkills,
        positionEmolument,
        positionSkills,
        positionExperience,
        positionEducation,
        positionDescribe
      ]).then(res => {
        this[action](formData)
      })
      .catch(err => app.wxToast({title: err}))
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-28
   * @detail   创建职位
   * @return   {[type]}   [description]
   */
  createPositionApi(formData) {
    createPositionApi(formData).then(res => {
      let options = this.data.options
      let params = {}
      let recruiterChatFirst = wx.getStorageSync('recruiter_chat_first')
      wx.removeStorageSync('createPosition')

      if(recruiterChatFirst) {
        params.jobhunterUid = recruiterChatFirst.jobhunterUid
        params.positionId = res.data.id
        this.applyInterview(params)
      } else {
        app.wxToast({
          title: '创建成功',
          icon: 'success',
          callback() {
            wx.navigateBack({delta: 1 })
          }
        })
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-28
   * @detail   编辑职位
   * @return   {[type]}   [description]
   */
  editPositionApi(formData) {
    editPositionApi(formData).then(res => {  
      app.wxToast({
        title: '编辑成功',
        icon: 'success',
        callback () {
          wx.removeStorageSync('createPosition')
          wx.reLaunch({url: `${RECRUITER}position/index/index`})
        }
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-02-13
   * @detail   绑定按钮状态
   * @return   {[type]}   [description]
   */
  bindButtonStatus() {
    let infos = this.data
    let canClick = infos.position_name
      && infos.type
      && infos.address_id
      // && infos.skills.length
      && infos.emolument_min
      && infos.skills.length
      && infos.work_experience
      && infos.education
      && infos.describe
      ? true : false
    this.setData({canClick})
  },
  showTips() {
    this.setData({showScanBox: !this.data.showScanBox})
  },
  copy() {
    wx.setClipboardData({data: 'https://lieduoduo.com' })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-03-15
   * @detail   招聘官申请开撩
   * @return   {[type]}   [description]
   */
  applyInterview(params) {
    applyInterviewApi(params).then(res => {
      wx.removeStorageSync('recruiter_chat_first')
      wx.redirectTo({url: `${COMMON}arrangement/arrangement?id=${res.data.interviewId}`})
    })
  }
})