import {
  createPositionApi,
  editPositionApi,
  getPositionApi
} from '../../../../../api/pages/position.js'

import {realNameReg, emailReg, positionReg} from '../../../../../utils/fieldRegular.js'

import {RECRUITER, COMMON} from '../../../../../config.js'

const app = getApp()

Page({
  data: {
    choseType: wx.getStorageSync('choseType') || null,
    userInfo: null,
    needLogin: false,
    position_name: '',
    company_id: '',
    lng: '',
    lat: '',
    area_id: '',
    address: '',
    doorplate: '',
    address_id: '',
    type: '',
    typeName: '',
    labels: [],
    emolument_min: '',
    emolument_max: '',
    emolument_range: '请选择薪资范围',
    work_experience: '',
    work_experience_name: '请选择经验要求',
    education: '',
    educationName: '请选择学历',
    describe: '',
    skills: [],
    query: {},
    pageTitle: '',
    canClick: false
  },
  onLoad(options) {
    this.setData({pageTitle: options.positionId ? '编辑职位' : '发布职位', query: options})
  },
  onShow() {
    const options = this.data.query
    this.init(options)
  },
  backEvent() {
    if(this.data.query.positionId) {
      app.wxConfirm({
        title: '放弃修改',
        content: '你编辑的职位尚未保存，确定放弃编辑吗？',
        confirmBack() {
          wx.removeStorageSync('createPosition')
          wx.navigateBack({delta: 1})
        },
      })
    } else {
      app.wxConfirm({
        title: '温馨提示',
        content: '离开当前页面，已填写的数据将会丢失，确认放弃发布吗？',
        cancelText: '继续编辑',
        confirmBack() {
          wx.removeStorageSync('createPosition')
          wx.navigateBack({delta: 1})
        }
      })
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-21
   * @detail   初始化页面数据
   * @return   {[type]}   [description]
   */
  init(options) {
    const storage = wx.getStorageSync('createPosition')

    const labels = []

    this.setData({query: options, company_id: app.globalData.recruiterDetails.companyInfo.id})
    
    if(storage) {
      Object.keys(storage).map(field => this.setData({[field]: storage[field]}))
      this.bindButtonStatus()
      return;
    }

    // 以下是编辑页面数据
    if(options.positionId) this.getUpdateInfos(options)
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-28
   * @detail   获取编辑页面的信息
   * @param    {[type]}   options [description]
   * @return   {[type]}           [description]
   */
  getUpdateInfos(options) {
    const storage = wx.getStorageSync('createPosition')
    if(storage) {
      Object.keys(storage).map(field => this.setData({[field]: storage[field]}))
      return;
    }
    getPositionApi({id: options.positionId})
      .then(res => {
        const formData = {}
        const infos = res.data
        formData.position_name = infos.positionName
        formData.area_id = infos.areaId
        formData.work_experience_name = infos.workExperience
        formData.type = infos.type
        formData.typeName = infos.typeName
        formData.emolument_min = infos.emolumentMin
        formData.emolument_max = infos.emolumentMax
        formData.emolument_range = `${formData.emolument_min}k~${formData.emolument_max}k`
        formData.doorplate = infos.doorplate
        formData.company_id = infos.companyId
        formData.address = infos.address
        formData.skills = infos.skillsLabel
        formData.describe = infos.describe
        formData.education = infos.education
        formData.educationName = infos.educationName
        formData.work_experience = infos.workExperience
        formData.work_experience_name = infos.workExperienceName
        formData.lng = infos.lng
        formData.lat = infos.lat
        formData.address_id = infos.addressId
        formData.parentType = infos.skillsLabel.length ? infos.skillsLabel[0].topPid : ''
        Object.keys(formData).map(field => this.setData({[field]: formData[field]}))
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
    const route = e.currentTarget.dataset.route
    const url = this.data.query.positionId
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
    const url = this.data.query.positionId
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
    const url = this.data.query.positionId
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
    const formData = {}
    const labels = []
    const action = this.data.query.positionId ? 'editPositionApi' : 'createPositionApi'
    const params = [
      'position_name',
      'company_id',
      'type',
      'area_id',
      'address',
      'labels',
      'doorplate',
      'emolument_min',
      'emolument_max',
      'work_experience',
      'education',
      'describe',
      'lng',
      'lat',
      'address_id',
    ]
    params.map(field => formData[field] = this.data[field])
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
    const positionName = new Promise((resolve, reject) => {
      !this.data.position_name ? reject('请填写职位名称') : resolve()
    })

    // 验证职位类型是否已经选择
    const positionType = new Promise((resolve, reject) => {
      !this.data.type ? reject('请选择职位类别') : resolve()
    })

    // 验证地址是否已经选择
    const positionAddress = new Promise((resolve, reject) => {
      !this.data.address_id ? reject('请选择地址') : resolve()
    })

    // 验证技能是否已经选择
    const positionSkills = new Promise((resolve, reject) => {
      !this.data.skills.length ? reject('请选择技能要求') : resolve()
    })

    // 验证薪资是否已经选择
    const positionEmolument = new Promise((resolve, reject) => {
      !this.data.emolument_min ? reject('请选择薪资范围') : resolve()
    })

    // 验证经验是否已经选择
    const positionExperience = new Promise((resolve, reject) => {
      !this.data.work_experience ? reject('请选择经验要求') : resolve()
    })

    // 验证学历是否已经选择
    const positionEducation = new Promise((resolve, reject) => {
      !this.data.education ? reject('请选择学历要求') : resolve()
    })

    // 验证职位描述是否已经完善
    const positionDescribe = new Promise((resolve, reject) => {
      !this.data.describe ? reject('请填写职位描述') : resolve()
    })

    Promise.all([
      positionName, 
      positionType, 
      positionAddress,
      positionSkills,
      positionEmolument,
      positionExperience,
      positionEducation,
      positionDescribe
    ]).then(res => {
      this[action](formData)
    })
    .catch(err => app.wxToast({title: err}))
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-28
   * @detail   创建职位
   * @return   {[type]}   [description]
   */
  createPositionApi(formData) {
    createPositionApi(formData)
      .then(res => {
        wx.removeStorageSync('createPosition')
        app.wxToast({
          title: '创建成功',
          icon: 'success',
          callback() {
            wx.navigateBack({delta: 1 })
          }
        })
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-28
   * @detail   编辑职位
   * @return   {[type]}   [description]
   */
  editPositionApi(formData) {
    editPositionApi(formData)
      .then(res => {
        wx.removeStorageSync('createPosition')
        wx.reLaunch({url: `${RECRUITER}position/index/index`})
        app.wxToast({title: '编辑成功'})
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-02-13
   * @detail   绑定按钮状态
   * @return   {[type]}   [description]
   */
  bindButtonStatus() {
    const infos = this.data
    const canClick = infos.position_name
      && infos.type
      && infos.address_id
      && infos.skills.length
      && infos.emolument_min
      && infos.work_experience
      && infos.education
      && infos.describe
      ? true : false
    this.setData({canClick})
  }
})