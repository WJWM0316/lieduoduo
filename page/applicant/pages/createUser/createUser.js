import wxAnimation from '../../../../utils/animation.js'
import {getSelectorQuery} from '../../../../utils/util.js'
import {getStepApi, 
        getCreatFirstStepApi, 
        postCreatFirstStepApi, 
        getCreatSecondStepApi, 
        postCreatSecondStepApi,
        getCreatThirdStepApi,
        postCreatThirdStepApi,
        getCreatFourthStepApi,
        postCreatFourthStepApi} from '../../../../api/pages/center.js'
import {COMMON, APPLICANT} from '../../../../config.js'
import {userNameReg, positionReg, schoolNameReg, majorNameReg} from '../../../../utils/fieldRegular.js'
import * as watch from '../../../../utils/watch.js'
const app = getApp()
let timer = null,
    duration = 1300, // 过场动画时间
    edNum = 1, // 教育经历份数， 默认一份
    shipNum = 0, // 实习经历份数
    lableArr = [], // 领域标签
    curTime = new Date().getTime() / 1000,
    directChat = ''
Page({
  /**
   * 页面的初始数据
   */
  data: {
    nav: app.globalData.navHeight,
    isBangs: app.globalData.isBangs,
    cdnImagePath: app.globalData.cdnImagePath,
    animationData: {},
    isStudent: false, // 是否在校生
    showPop: false,
    step: -1, // 创建步数
    active: null,
    avatar: {},
    gender: 1,
    name: '',
    birthDesr: '',
    birth: 0,
    startWorkYearDesc: '',
    startWork: 0,
    workCurrent: 0,
    edCurrent: 0,
    workErr: 0,
    edErr: 0,
    workData: [
      {
        company: '',
        positionTypeId: 0,
        positionType: '',
        position: '',
        startTime: 0,
        startTimeDesc: '',
        endTime: 0,
        endTimeDesc: '',
        duty: ''
      }
    ],
    edData: [
      {
        company: '',
        positionTypeId: 0,
        positionType: '',
        position: '',
        startTime: 0,
        startTimeDesc: '',
        endTime: 0,
        endTimeDesc: '',
        duty: '',
        school: '',
        major: '',
        degree: 0,
        degreeDesc: '',
        type: 'education'
      }
    ],
    intention: {
      cityNum: 0,
      city: '',
      positionId: 0,
      position: '',
      salaryCeil: 0,
      salaryFloor: 0,
      salary: '',
      fieldIds: '',
      fiels: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.loginInit) {
      this.getStep()
    } else {
      app.loginInit = () => {
        this.getStep()
      }
    }
    if (options.directChat) {
      directChat = options.directChat
    }
    watch.setWatcher(this)
  },
  watch: {    
    step: function(newVal, oldVal) {
      if (newVal !== oldVal) {
        switch (newVal) {
          case 1:
            newVal = 1
            this.getStepData(newVal)
            break
          case 3:
            newVal = 2
            this.getStepData(newVal)
            break
          case 5:
            newVal = 3
            this.getStepData(newVal)
            break
          case 7:
            newVal = 4
            this.getStepData(newVal)
            break
        }
      }
    }
  },
  progress (step) {
    this.setData({step}, () => {
      this.setData({active: step})
      if (step < 8) {
        if (step !== 0 && step%2 !== 0) return
        timer = setTimeout(() => {
          step++
          if (step > 7) {
            clearTimeout(timer)   
          } else {
            this.progress(step)
          }
        }, duration)
      } else {
        app.getAllInfo().then(res => {
          timer = setTimeout(() => {
            if (!directChat) {
              wx.navigateBack({
                delta: 1
              })
            } else {
              let path = `${decodeURIComponent(directChat)}&directChat=true`
              wx.redirectTo({
                url: path
              })
            }
          }, 1000)
        })
      }
    })
  },
  toggle (e) {
    let getData = e.currentTarget.dataset
    let type = '',
        typeValue = null,
        lastItem = null // 最后一个item的下标
    if (this.data.step === 3) { // 工作经历toggle
      type = 'workCurrent'
      typeValue = this.data.workCurrent
      lastItem = this.data.workData.length - 1
    } else { // 教育经历toggle
      type = 'edCurrent' 
      typeValue = this.data.edCurrent
      lastItem = this.data.edData.length - 1
    }
    switch (getData.type) {
      case 'next':
        typeValue++
        if (typeValue > lastItem) typeValue = 0
        break
      case 'prev':
        typeValue--
        if (typeValue < 0) typeValue = lastItem
        break
      case 'change':
        typeValue = e.detail.current
        break
      case 'index':
        typeValue = getData.index
    }
    this.setData({[type]: typeValue})
  },
  addItem (e) {
    let getData = e.currentTarget.dataset
    let type = ''
    let listKey = ''
    let list = []
    let current = 0
    let pushItem = {}
    switch (getData.type) {
      case 'work':
        if (this.data.workData.length >= 3) {
          app.wxToast({title: '最多可添加3份工作经历哦'})
          return
        }
        listKey = 'workData'
        type = 'workCurrent'
        current = this.data.workCurrent
        list = this.data.workData
        break
      case 'education':
        if (edNum >= 2) {
          app.wxToast({title: '最多只能添加两份教育经历'})
          return
        }
        edNum++
        listKey = 'edData'
        type = 'edCurrent'
        current = this.data.edCurrent
        list = this.data.edData
        pushItem = {type: 'education', degreeDesc: '本科', degree: 25}
        break
      case 'internship':
        if (shipNum >= 2) {
          app.wxToast({title: '最多只能添加两份实习经历'})
          return
        }
        shipNum++
        listKey = 'edData'
        type = 'edCurrent'
        current = this.data.edCurrent
        list = this.data.edData
        pushItem = {type: 'internship'}
        break
    }
    list.push({...pushItem})
    this.setData({[listKey]: list, [type]: list.length - 1})
  },
  remove (e) {
    let getData = e.currentTarget.dataset,
        type = '',
        listKey = '',
        list = [],
        current = 0,
        errType = '',
        err = 0,
        isConfirm = true,
        that = this
    switch (getData.type) {
      case 'work':
        listKey = 'workData'
        type = 'workCurrent'
        errType = 'workErr'
        current = this.data.workCurrent
        list = this.data.workData
        if (!list[current].company && !list[current].duty && !list[current].endTime && !list[current].startTime && !list[current].positionTypeId) {
          isConfirm = false
        }
        break
      case 'education':
        listKey = 'edData'
        type = 'edCurrent'
        errType = 'edErr'
        current = this.data.edCurrent
        list = this.data.edData
        if (list[current].type === 'education') { // 删除教育经历
          if (edNum === 1) {
            app.wxToast({title: '至少保留一份教育经历'})
            return
          }
        } else {
          if (!list[current].company && !list[current].duty && !list[current].endTime && !list[current].startTime && !list[current].positionTypeId) {
            isConfirm = false
          }
        }
        break
    }
    let oper = () => {
      if (that.data[errType] === current + 1) {
        err = 0
      } else {
        err = that.data[errType]
      }
      if (list[current].type === 'education') {
        edNum--
      } else {
        shipNum--
      }
      if (current !== 0 && current <= list.length - 1) {
        list.splice(current, 1)
        current --
        that.setData({[type]: current, [listKey]: list, [errType]: err})
      } else {
        list.splice(current, 1)
        that.setData({[listKey]: list, [errType]: err})
      }
    }
    if (isConfirm) {
      app.wxConfirm({
        title: '删除档案',
        content: `删除后无法恢复，确认是否要删除0${current + 1}档案？`,
        confirmBack() {
          oper()
        }
      }) 
    } else {
      oper()
    }
  },
  continue () {
    this.submitFun().then(res => {
      let step = this.data.step
      step++
      this.progress(step)
    })
  },
  submitFun () {
    switch (this.data.step) {
      case 1:
        return this.postFirstFun()
        break
      case 3:
        return this.postSecondFun()
        break
      case 5:
        return this.postThirdFun()
      case 7: 
        return this.postFourthFun()
        break
    }
  },
  postFirstFun () {
    let data = this.data
    let params = {
      avatar: data.avatar.id,
      gender: data.gender,
      name: data.name,
      birth: data.birth,
      startWorkYear: data.startWorkYear
    }
    let title = ''
    if (!params.avatar) {
      title = '请上传头像'
    } else if (!params.gender) {
      title = '请选择性别'
    } else if (!params.name) {
      title = '请输入姓名'
    } else if (!userNameReg.test(params.name)) {
      title = '姓名需为2-20个汉字或英文'
    } else if (!params.birth) {
      title = '请选择出身年月'
    } else if (!params.startWorkYear && params.startWorkYear !== 0) {
      title = '请选择参加工作时间'
    }
    if (title) {
      app.wxToast({title})
      return new Promise((resolve, reject) => {reject(title)})
    }
    return postCreatFirstStepApi(params).then(res => {
      if (params.startWorkYear === 0) {
        let step = this.data.step
        let isStudent = true
        this.setData({step: step + 2, isStudent})
      } else {
        if (this.data.isStudent) this.setData({isStudent: false})
      }
    })
  },
  postSecondFun () {
    let data = this.data,
        params = this.data.workData,
        title = '',
        workErr = 0,
        workCurrent = 0
    for (var i = 0; i < params.length; i++) {
      if (!params[i].company || !params[i].positionTypeId || !params[i].position || !params[i].startTime || (!params[i].endTime && params[i].endTime !== 0) || !params[i].duty) {
        title = ''
        workErr = i + 1
        workCurrent = i
        break
      } else {
        if (!positionReg.test(params[i].position)) {
          title = '职位名称需为2-20个字符'
          workErr = i + 1
          workCurrent = i
          break
        } else if ((params[i].endTime !== 0 && params[i].startTime > params[i].endTime) || (params[i].endTime === 0 && params[i].startTime > curTime)) {
          title = '开始时间不能晚于结束时间'
          workErr = i + 1
          workCurrent = i
          break
        } else {
          if (workErr) {
            this.setData({workErr: 0})
            workErr = 0
          }
        } 
      }
    }
    if (workErr) {
      this.setData({workErr, workCurrent}, () => {
        if (title) app.wxToast({title})
      })
      return new Promise((resolve, reject) => {reject(`第${workErr}个工作经历档案信息不完整, 无法提交`)})
    }
    return postCreatSecondStepApi({careers: params}).then(res => {
      this.setData({workErr: 0})
    })
  },
  postThirdFun () {
    let params = this.data.edData,
        educations = [],
        title = '',
        internships = [],
        edErr = 0,
        edCurrent = 0
    for (var i = 0; i < params.length; i++) {
      if (params[i].type === 'education') {
        if (params[i].type === 'education') {
          if (!params[i].school || !params[i].major || !params[i].startTime || (!params[i].endTime && params[i].endTime !== 0) || !params[i].degree) {
            title = ''
            edErr = i + 1
            edCurrent = i
            break
          } else {
            if (!schoolNameReg.test(params[i].school)) {
              title = '学校名称需为2-50个字符'
              edErr = i + 1
              edCurrent = i
              break
            } else if (!majorNameReg.test(params[i].major)) {
              title = '专业名称需为2-50个字符'
              edErr = i + 1
              edCurrent = i
            } else if ((params[i].endTime !== 0 && params[i].startTime > params[i].endTime) || (params[i].endTime === 0 && params[i].startTime > curTime)) {
              title = '开始时间不能晚于结束时间'
              edErr = i + 1
              edCurrent = i
              break
            }
          }
        }
      } else {
        if (!params[i].company || !params[i].positionTypeId || !params[i].position || !params[i].startTime || (!params[i].endTime && params[i].endTime !== 0) || !params[i].duty) {
          title = ''
          edErr = i + 1
          edCurrent = i
          break
        } else {
            if (!positionReg.test(params[i].position)) {
            title = '职位名称需为2-20个字符'
            edErr = i + 1
            edCurrent = i
            break
          } else if ((params[i].endTime !== 0 && params[i].startTime > params[i].endTime) || (params[i].endTime === 0 && params[i].startTime > curTime)) {
            title = '开始时间不能晚于结束时间'
            edErr = i + 1
            edCurrent = i
            break
          }
        }
      }
    }
    if (edErr) {
      this.setData({edErr, edCurrent}, () => {
        if (title) app.wxToast({title})
      })
      return new Promise((resolve, reject) => {reject(`第${edErr}个工作经历档案信息不完整, 无法提交`)})
    }
    this.data.edData.forEach((item) => {
      if (item.type === 'education') {
        educations.push(item)
      } else {
        internships.push(item)
      }
    })
    return postCreatThirdStepApi({educations, internships}).then(res => {
      this.setData({edErr: 0})
    })
  },
  postFourthFun () {
    let params = this.data.intention
    let title = ''
    if (!params.cityNum ) {
      title = '请选择期望城市'
    } else if (!params.positionId ) {
      title = '请选择期望职位'
    } else if (!params.salaryCeil) {
      title = '请选择期望薪资'
    } else if (!params.fieldIds ) {
      title = '请选择期望领域'
    }
    if (title) {
      app.wxToast({title})
      return new Promise((resolve, reject) => {reject(title)})
    }
    return postCreatFourthStepApi(params)
  },
  getStepData (step) {
    switch (step) {
      case 1:
        return getCreatFirstStepApi().then(res => {
          let avatar = res.data.avatar
          let birth = res.data.birth
          let birthDesc = res.data.birthDesc
          let gender = res.data.gender
          let name = res.data.name
          let startWorkYearDesc = res.data.startWorkYearDesc
          let startWorkYear = res.data.startWorkYear
          let isStudent = this.data.isStudent
          if (startWorkYear === 0) {
            isStudent = true
          } else {
            isStudent = false
          }
          this.setData({avatar, name, gender, birth, birthDesc, startWorkYear, startWorkYearDesc, isStudent})
        })
        break
      case 2:
        return getCreatSecondStepApi().then(res => {
          let workData = res.data
          if (workData.length === 0) workData = [{}]
          this.setData({workData, workCurrent: 0})
        })
        break
      case 3:
        return getCreatThirdStepApi().then(res => {
          let edData = []
          res.data.educations.forEach((item) => {
            item.type = 'education'
            if (!item.degreeDesc) {
              item.degreeDesc = '本科'
              item.degree = 25
            }
          })
          edData = edData.concat(res.data.educations).concat(res.data.internships)
          if (edData.length === 0) edData = [{type: 'education', degreeDesc: '本科', degree: 25}]
          edNum = res.data.educations.length || 1
          shipNum = res.data.internships.length
          this.setData({edData, edCurrent: 0})
        })
        break
      case 4: 
        return getCreatFourthStepApi().then(res => {
          let intention = this.data.intention
          intention.positionId = res.data.positionId
          intention.position = res.data.position
          this.setData({intention})
        })
    }
  },
  getStep () {
    getStepApi().then(res => {
      let step = res.data.step
      switch (step) {
        case 1:
          step = 0
          break
        case 2:
          step = 3
          break
        case 3:
          step = 5
          this.getStepData(1)
          break
        case 4:
          step = 7
          this.getStepData(1)
          break
        case 9:
          step = 0
          break  
      }
      this.setData({step}, () => {
        this.progress(step)
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let step = this.data.step
    this.progress(step)
  },
  getresult (e) {
    let getData = e.currentTarget.dataset
    let detail = e.detail
    switch (getData.type) {
      case 'workTime':
        this.setData({startWorkYearDesc: e.detail.propsDesc, startWorkYear: e.detail.propsResult})
        break
      case 'birth':
        this.setData({birthDesr: e.detail.propsDesc, birth: e.detail.propsResult})
        break
      case 'startTime':
        var index = 0,
            list = [],
            key = ''
        if (this.data.step === 3) {
          index = this.data.workCurrent
          key = 'workData'
          list = this.data.workData
        } else {
          index = this.data.edCurrent
          key = 'edData'
          list = this.data.edData
        }
        list[index].startTime = e.detail.propsResult
        list[index].startTimeDesc = e.detail.propsDesc
        this.setData({[key]: list})
        break
      case 'endTime':
        var index = 0,
            list = [],
            key = ''
        if (this.data.step === 3) {
          index = this.data.workCurrent
          key = 'workData'
          list = this.data.workData
        } else {
          index = this.data.edCurrent
          key = 'edData'
          list = this.data.edData
        }
        list[index].endTime = e.detail.propsResult
        list[index].endTimeDesc = e.detail.propsDesc
        this.setData({[key]: list})
        break
      case 'education':
        var index = this.data.edCurrent,
            edData = this.data.edData
        edData[index].degree = e.detail.propsResult
        edData[index].degreeDesc = e.detail.propsDesc
        this.setData({edData})
        break
      case 'salary':
        let intention = this.data.intention
        intention.salaryFloor = parseInt(e.detail.propsResult[0])
        intention.salaryCeil = parseInt(e.detail.propsResult[1])
        intention.salary = e.detail.propsDesc
        this.setData({intention})
        break
    }
  },
  chooseGender (e) {
    let gender = e.currentTarget.dataset.gender
    this.setData({gender})
  },
  getValue (e) {
    clearTimeout(timer)
    let getData = e.currentTarget.dataset
    let value = e.detail.value
    let key = ''
    switch (getData.type) {
      case 'name':
        key = 'name'
        break
      case 'positionName':
        if (this.data.step === 3) {
          key = 'workData'
          var workData = this.data.workData
          workData[this.data.workCurrent].position = value
          value = workData
        } else {
          key = 'edData'
          var edData = this.data.edData
          edData[this.data.edCurrent].position = value
          value = edData
        }
        break
      case 'schoolName':
        key = 'edData'
        var edData = this.data.edData
        edData[this.data.edCurrent].school = value
        value = edData
        break
      case 'major':
        key = 'edData'
        var edData = this.data.edData
        edData[this.data.edCurrent].major = value
        value = edData
        break
    }
    timer = setTimeout(() => {
      this.setData({[key]: value})
      clearTimeout(timer)
    }, 300)
  },
  jump (e) {
    let type = e.currentTarget.dataset.type
    let url = ''
    switch (type) {
      case 'companyName':
        url = `${APPLICANT}searchCompany/searchCompany`
        wx.setStorageSync('createdCompany', e.currentTarget.dataset.value)
        break
      case 'positionType':
        url = `${COMMON}category/category?hot=true`
        wx.setStorageSync('positionType', e.currentTarget.dataset.id)
        break
      case 'workContent':
        url = `${APPLICANT}center/workContent/workContent`
        wx.setStorageSync('workContent', e.currentTarget.dataset.value)
        break
      case 'fiels':
        url = `${APPLICANT}center/resumeEditor/skills/skills?target=2`
        wx.setStorageSync('skillsLabel', lableArr)
        break
      case 'city':
        url = `${COMMON}selectCity/selectCity`
        wx.setStorageSync('selectCity', e.currentTarget.dataset.id)
        break
    }
    wx.navigateTo({url})
  },
  backEvent () {
    let step = this.data.step
    if (step === 0 || step === 1) {
      this.setData({showPop: true})
    } else {
      if (step === 4 || step === 5 && this.data.isStudent) { // 处在第三步返回的时候要看看是不是在校生
        step -= 4
      } else {
        step -= 2
      }
      this.setData({step, edErr: 0, workErr: 0}, () => {
        this.progress(step)
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let avatar = wx.getStorageSync('avatar')
    let positionType = wx.getStorageSync('createPosition')
    let companyName = wx.getStorageSync('companyName')
    let workContent = wx.getStorageSync('workContent')
    let skillsLabel = wx.getStorageSync('skillsLabel')
    let selectCity = wx.getStorageSync('selectCity')
    let userInfo = app.globalData.userInfo
    let listType = '',
        listValue = [],
        index = null
    if (this.data.step === 3) { // 工作经历
      listType = 'workData'
      listValue = this.data.workData
      index = this.data.workCurrent
    } else if (this.data.step === 5) { // 教育经历
      listType = 'edData'
      listValue = this.data.edData
      index = this.data.edCurrent
    } else { // 求职意向
      listType = 'intention'
      listValue = this.data.intention
    }
    if (avatar) {
      this.setData({avatar}, () => {
        wx.removeStorageSync('avatar')
      })
    }
    if (!avatar && userInfo) {
      avatar = userInfo.avatarInfo
      let gender = userInfo.gender
      this.setData({avatar, gender})
    }
    if (companyName) {
      listValue[index].company = companyName
      this.setData({[listType]: listValue}, () => {
        wx.removeStorageSync('companyName')
      })
    }
    if (positionType) {
      if (index || index === 0) {
        listValue[index].positionTypeId = positionType.type
        listValue[index].positionType = positionType.typeName
        if (!listValue[index].position) listValue[index].position = positionType.typeName
      } else {
        listValue.position = positionType.typeName
        listValue.positionId = positionType.type
      }
      this.setData({[listType]: listValue}, () => {
        wx.removeStorageSync('createPosition')
      })
    }
    if (workContent) {
      listValue[index].duty = workContent
      this.setData({[listType]: listValue}, () => {
        wx.removeStorageSync('workContent')
      })
    }
    if (skillsLabel) {
      let fieldIds = [],
          fiels = []
      lableArr = skillsLabel
      lableArr.forEach((item) => {
        fieldIds.push(item.labelId)
        fiels.push(item.name)
      })
      listType = 'intention'
      listValue = this.data.intention
      listValue.fieldIds = fieldIds.join(',')
      listValue.fiels = fiels.join(',')
      this.setData({[listType]: listValue}, () => {
        wx.removeStorageSync('skillsLabel')
      })
    } else {
      lableArr = []
    }
    if (selectCity) {
      listType = 'intention'
      listValue = this.data.intention
      listValue.cityNum = selectCity.areaId
      listValue.city = selectCity.title || selectCity.name
      this.setData({[listType]: listValue}, () => {
        wx.removeStorageSync('selectCity')
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})