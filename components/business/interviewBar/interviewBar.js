import {
  applyInterviewApi,
  getInterviewStatusApi,
  inviteInterviewApi,
  refuseInterviewApi,
  confirmInterviewApi,
  notonsiderInterviewApi
} from '../../../api/pages/interview.js'

import {
  getPositionApi,
  openPositionApi,
  closePositionApi
} from '../../../api/pages/position.js'

import {
  getCompanyIdentityInfosApi
} from '../../../api/pages/company.js'

import {RECRUITER, COMMON, APPLICANT} from '../../../config.js'

import { agreedTxtC, agreedTxtB } from '../../../utils/randomCopy.js'

const app = getApp()

Component({
  properties: {
    infos: {
      type: Object,
      value: {}
    },
    isOwner: {
      type: Boolean,
      value: false
    },
    // 跟后端协商的type
    type: {
      type: String,
      value: ''
    },
    positionId: {
      type: String,
      value: ''
    }
  },
  data: {
    interviewInfos: {},
    showLoginBox: false,
    identity: '', // 身份标识
    slogoIndex: 0,
    // 是否是我发布
    isOwerner: false,
    currentPage: '',
    index: 0,
    jobWords: agreedTxtC(),
    recruiterWords: agreedTxtB(),
    isShare: false
  },
  attached() {
    switch(this.data.type) {
      case 'resume':
        if (wx.getStorageSync('choseType') !== 'RECRUITER') this.setData({isOwerner: true})
        break
      case 'recruiter':
        if (wx.getStorageSync('choseType') === 'RECRUITER') this.setData({isOwerner: true})
        break
    }
  },
  methods: {
    init() {
      console.log(2222222222222)
      this.getInterviewStatus()
      let currentPage = ''
      switch(this.data.type) {
        case 'position':
          currentPage = 'positionDetail'
          break
        case 'resume':
          currentPage = 'resumeDetail'
          break
        case 'recruiter':
          currentPage = 'recruiterDetail'
          break
        default:
          currentPage = ''
          break
      }
      this.setData({currentPage, jobWords: agreedTxtC(), recruiterWords: agreedTxtB()})
    },
    /**
     * @Author   小书包
     * @DateTime 2019-01-05
     * @detail   获取开料状态
     * @return   {[type]}   [description]
     */
    getInterviewStatus() {
      console.log(1111111111111111111)
      getInterviewStatusApi({type: this.data.type, vkey: this.data.infos.vkey}).then(res => {
        this.setData({interviewInfos: res.data, identity: wx.getStorageSync('choseType')})
        if(res.code === 204) this.setData({isOwerner: true})
        if(res.code === 230) this.showMergeBox(res.data)
      })
    },
    /**
     * @Author   小书包
     * @DateTime 2019-01-14
     * @detail   显示合并弹窗
     * @return   {[type]}         [description]
     */
    showMergeBox(infos) {
      const content = infos.tipsData.positionId === 0
        ? '招聘官已接受与你约面，但没有选择约面职位，其他职位申请将自动合并，如需修改约面职位，可直接与招聘官协商'
        : `招聘官已选择你申请职位中的“${infos.tipsData.positionName}”，其他职位申请将自动合并，如需修改约面职位，可直接与招聘官协商。`
      app.wxConfirm({
        title: '',
        content,
        showCancel: false,
        confirmText: '我知道了',
        confirmBack() {}
      })
    },
    /**
     * @Author   小书包
     * @DateTime 2019-01-22
     * @detail   获取范围内随机数
     * @return   {[type]}       [description]
     */
    getRandomNum(Min, Max) {
      var Range = Max - Min
      var Rand = Math.random()
      var num = Min + Math.floor(Rand * Range)
      return num
    },
    /**
     * @Author   小书包
     * @DateTime 2019-01-30
     * @detail   通过分享入口进行开撩
     * @return   {[type]}   [description]
     */
    shareChat() {
      let identity = wx.getStorageSync('choseType')
      let hasLogin = app.globalData.hasLogin
      let isRecruiter = app.globalData.isRecruiter
      let isJobhunter = app.globalData.isJobhunter
      let interviewInfos = this.data.interviewInfos

      const getRole = () => {
        if(app.getRoleInit) {
          chat()
        } else {
          app.getRoleInit = () => chat()
        }
      }

      // 开撩动作
      const chat = () => {
        isRecruiter = app.globalData.isRecruiter
        isJobhunter = app.globalData.isJobhunter
        if(identity === 'APPLICANT') {
          if(!isJobhunter) {
            wx.navigateTo({url: `${APPLICANT}center/createUser/createUser`})
          } else {
            // 走正常流程
            if(this.data.type === 'recruiter') {

              wx.navigateTo({url: `${RECRUITER}position/jobList/jobList?type=job_hunting_chat&from=${this.data.currentPage}&showNotPositionApply=${interviewInfos.showNotPositionApply}&from=${this.data.currentPage}&recruiterUid=${this.data.infos.uid}`})
            } else {
              applyInterviewApi({recruiterUid: this.data.infos.recruiterInfo.uid, positionId: this.data.infos.id}).then(res => {
                this.getInterviewStatus()
                app.wxToast({title: '面试申请已发送'})
              })
            }
          }
        } else {
          if(!isRecruiter) {
            this.getCompanyIdentityInfos()
          } else {
            // 走正常流程
            wx.navigateTo({url: `${RECRUITER}position/jobList/jobList?type=recruiter_chat&from=${this.data.currentPage}&jobhunterUid=${this.data.infos.uid}&recruiterUid=${app.globalData.recruiterDetails.uid}`})
          }
        }
      }

      // 判断用户是否登录
      if (app.loginInit) {
        if (!app.globalData.hasLogin) {
          this.setData({showLoginBox: true})
        } else {
          getRole()
        }
      } else {
        app.loginInit = () => {
          if (!app.globalData.hasLogin) {
            this.setData({showLoginBox: true})
          } else {
            getRole()
          }
        }
      }      
    },
    /**
     * @Author   小书包
     * @DateTime 2019-01-29
     * @detail   获取个人身份信息
     * @return   {[type]}   [description]
     */
    getCompanyIdentityInfos() {
      getCompanyIdentityInfosApi().then(res => {
        const companyInfo = res.data.companyInfo
        if(companyInfo.status !== 1) {
          wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=company`})
        }
      })
    },
    /**
     * @Author   小书包
     * @DateTime 2019-01-02
     * @detail   待办项
     * @return   {[type]}     [description]
     */
    todoAction(e) {
      const action = e.currentTarget.dataset.action
      const interviewInfos = this.data.interviewInfos
      const infos = this.data.infos
      switch(action) {
        // 求职端发起开撩
        case 'job-hunting-chat':
          this.shareChat()

          break
        case 'job-hunting-applyed':
          // app.wxConfirm({
          //   title: '开撩约面',
          //   content: '该招聘官已邀请你面试了哦，暂时不能再申请约面',
          //   confirmText: '去看看',
          //   showCancel: true,
          //   cancelText: '知道了',
          //   confirmBack() {
          //     wx.navigateTo({url: `${COMMON}arrangement/arrangement?id=${interviewInfos.data[0].interviewId}`})
          //   }
          // })
          app.wxToast({title: '面试申请已发送'})
          break
        case 'recruiter-chat':
          this.shareChat()
          // wx.navigateTo({url: `${RECRUITER}position/jobList/jobList?type=recruiter_chat&from=${this.data.currentPage}&jobhunterUid=${this.data.infos.uid}&recruiterUid=${app.globalData.recruiterDetails.uid}`})
          break
        case 'job-hunting-waiting-interview':
          app.wxToast({title: '等待招聘官安排面试'})
          break
        // 求职者等待招聘管确认
        case 'waiting-staff-confirm':
          app.wxToast({title: '等待求职者确认'})
          break
        // 求职者接受约面
        case 'job-hunting-accept':
          confirmInterviewApi({id: interviewInfos.data[0].interviewId}).then(res => {
            app.wxToast({title: '已接受约面'})
            // this.triggerEvent('resultevent', this.data.infos)
            this.getInterviewStatus()
          })
          break
        // 求职端拒绝招聘官
        case 'job-hunting-reject':
          if(this.data.type === 'recruiter') {
            refuseInterviewApi({id: this.data.infos.uid}).then(res => {
              this.getInterviewStatus()
            })
          } else {
            app.wxConfirm({
              title: '暂不考虑该职位',
              content: '确定暂不考虑后，招聘官将终止这次约面流程',
              showCancel: true,
              cancelText: '我再想想',
              confirmText: '确定',
              cancelColor: '#BCBCBC',
              confirmColor: '#652791',
              confirmBack: () => {
                refuseInterviewApi({id: this.data.infos.recruiterInfo.uid}).then(res => {
                  this.getInterviewStatus()
                  // this.triggerEvent('resultevent', res)
                })
              }
            })
          }
          break
        // 招聘官拒绝求职者
        case 'recruiter-reject':
          if(interviewInfos.data.length > 1) {
            wx.navigateTo({url: `${RECRUITER}position/jobList/jobList?type=reject_chat&from=${this.data.currentPage}&jobhunterUid=${infos.uid}`})
            wx.setStorageSync('interviewChatLists', this.data.interviewInfos)
          } else {
            app.wxConfirm({
              title: '该求职者不适合',
              content: '确定标记该求职者为不适合后，将终止这次约面流程',
              showCancel: true,
              cancelText: '我再想想',
              confirmText: '确定',
              cancelColor: '#BCBCBC',
              confirmColor: '#652791',
              confirmBack: () => {
                refuseInterviewApi({id: infos.uid}).then(() => this.getInterviewStatus())
              }
            })
          }
          // console.log(interviewInfos);return;
          // wx.navigateTo({url: `${RECRUITER}position/jobList/jobList?type=reject_chat&from=${this.data.currentPage}`})
          // wx.setStorageSync('interviewChatLists', this.data.interviewInfos)
          // if(interviewInfos.data.length > 1) {
          //   wx.navigateTo({url: `${RECRUITER}position/jobList/jobList?type=reject_chat`})
          //   wx.setStorageSync('interviewChatLists', this.data.interviewInfos)
          // } else {
          //   refuseInterviewApi({id: interviewInfos.data[0].interviewId})
          //     .then(res => {
          //       this.getInterviewStatus()
          //       this.triggerEvent('resultevent', res)
          //     })
          // }
          break
        // 求职者查看面试详情
        case 'job-hunting-view-detail':
          wx.navigateTo({url: `${COMMON}arrangement/arrangement?id=${interviewInfos.data[0].interviewId}`})
          break
        // 招聘官查看面试安排
        case 'recruiter-view-detail':
          wx.navigateTo({url: `${COMMON}arrangement/arrangement?id=${interviewInfos.data[0].interviewId}`})
          break
        // B端开撩成功后跳转安排面试页面
        case 'recruiter-accept':
          // wx.navigateTo({url: `${RECRUITER}position/jobList/jobList?type=confirm_chat&from=${this.data.currentPage}`})
          // wx.setStorageSync('interviewChatLists', this.data.interviewInfos)
          // 求职者发起多条撩的记录
          if(interviewInfos.data.length > 1) {
            wx.navigateTo({url: `${RECRUITER}position/jobList/jobList?type=confirm_chat&from=${this.data.currentPage}`})
            wx.setStorageSync('interviewChatLists', this.data.interviewInfos)
          } else {
            confirmInterviewApi({id: interviewInfos.data[0].interviewId}).then(res => {
              // this.triggerEvent('resultevent', res)
              wx.navigateTo({url: `${COMMON}arrangement/arrangement?id=${interviewInfos.data[0].interviewId}`})
            })
          }
          break
        case 'recruiter-apply':
          wx.navigateTo({url: `${COMMON}arrangement/arrangement?id=${interviewInfos.data[0].interviewId}`})
          break
        case 'recruiter-modify':
          wx.navigateTo({url: `${COMMON}arrangement/arrangement?id=${interviewInfos.data[0].interviewId}`})
          break
        case 'recruiter-arrangement':
          wx.navigateTo({url: `${COMMON}arrangement/arrangement?id=${interviewInfos.data[0].interviewId}`})
          break
        case 'viewRecruiter':
          if(this.data.type === 'position') wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${this.data.infos.recruiterInfo.uid}`})
          break
        default:
          break
      }
    }
  }
})
