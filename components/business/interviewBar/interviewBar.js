import {
  applyInterviewApi,
  getInterviewStatusApi,
  inviteInterviewApi,
  refuseInterviewApi,
  confirmInterviewApi
} from '../../../api/pages/interview.js'

import {
  getPositionApi,
  openPositionApi,
  closePositionApi
} from '../../../api/pages/position.js'

import {RECRUITER, COMMON} from '../../../config.js'

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
    },
    currentPage: {
      type: String,
      value: ''
    }
  },
  data: {
    interviewInfos: {},
    identity: '', // 身份标识
    slogoIndex: 0,
    // 是否是我发布
    isOwerner: false,
    currentPage: ''
  },
  attached() {
    // this.init()
  },
  methods: {
    init() {
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
      this.setData({currentPage})
    },
    /**
     * @Author   小书包
     * @DateTime 2019-01-05
     * @detail   获取开料状态
     * @return   {[type]}   [description]
     */
    getInterviewStatus() {
      getInterviewStatusApi({type: this.data.type, vkey: this.data.infos.vkey})
        .then(res => {
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
        confirmBack() {
          //
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
      switch(action) {
        case 'open':
          openPositionApi({id: this.data.infos.id})
            .then(res => {
              this.triggerEvent('resultevent', res)
            })
          break
        case 'close':
          closePositionApi({id: this.data.infos.id})
            .then(res => {
              this.triggerEvent('resultevent', res)
            })
          break
        // 求职端发起开撩
        case 'job-hunting-chat':
          // 招聘管主页 直接跳转职位列表
          if(this.data.type === 'recruiter') {
            wx.navigateTo({url: `${RECRUITER}position/jobList/jobList?type=job_hunting_chat&from=${this.data.currentPage}&showNotPositionApply=${interviewInfos.showNotPositionApply}&from=${this.data.currentPage}&recruiterUid=${this.data.infos.uid}`})
          } else {
            applyInterviewApi({recruiterUid: this.data.infos.recruiterInfo.uid, positionId: this.data.infos.id})
              .then(res => {
                this.getInterviewStatus()
                app.wxToast({title: '面试申请已发送'})
                this.triggerEvent('resultevent', res)
              })
          }
          // let uid = ''
          // let positionId = ''
          // let params = {}
          // if (this.data.type === 'position') {
          //   params.recruiterUid = this.data.infos.recruiterInfo.uid
          //   params.positionId = this.data.infos.id
          // } else if(this.data.type === 'recruiter') {
          //   params.recruiterUid = this.data.infos.uid
          // } else {
          //   params.recruiterUid = this.data.infos.uid
          //   params.positionId = this.data.positionId
          // }
          // applyInterviewApi(params)
          //   .then(res => {
          //     this.getInterviewStatus()
          //     app.wxToast({title: '面试申请已发送'})
          //     this.triggerEvent('resultevent', res)
          //   })
          break
        case 'job-hunting-applyed':
          app.wxToast({title: '等待面试官处理'})
          break
        case 'recruiter-chat':
          wx.navigateTo({url: `${RECRUITER}position/jobList/jobList?type=recruiter_chat&from=${this.data.currentPage}&jobhunterUid=${this.data.infos.uid}&recruiterUid=${this.data.infos.uid}`})
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
          confirmInterviewApi({id: interviewInfos.data[0].interviewId})
            .then(res => {
              app.wxToast({title: '已接受约面'})
              this.triggerEvent('resultevent', res)
              this.getInterviewStatus()
            })
          break
        // 求职端拒绝招聘官
        case 'job-hunting-reject':
          if(this.data.type === 'recruiter') {
            wx.navigateTo({url: `${RECRUITER}position/jobList/jobList?type=reject_chat&from=${this.data.currentPage}&showNotPositionApply=${interviewInfos.showNotPositionApply}&from=${this.data.currentPage}&jobhunterUid=${this.data.infos.uid}`})
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
                refuseInterviewApi({id: interviewInfos.data[0].interviewId})
                  .then(res => {
                    this.getInterviewStatus()
                    this.triggerEvent('resultevent', res)
                  })
              }
            })
          }
          break
        // 招聘官拒绝求职者
        case 'recruiter-reject':
          wx.navigateTo({url: `${RECRUITER}position/jobList/jobList?type=reject_chat&from=${this.data.currentPage}`})
          wx.setStorageSync('interviewChatLists', this.data.interviewInfos)
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
        // 招聘管编辑职位
        case 'recruiter-edit':
          wx.navigateTo({url: `${RECRUITER}position/post/post?positionId=${this.data.infos.id}`})
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
          wx.navigateTo({url: `${RECRUITER}position/jobList/jobList?type=confirm_chat&from=${this.data.currentPage}`})
          wx.setStorageSync('interviewChatLists', this.data.interviewInfos)
          // if(interviewInfos.data.length > 1) {
          //   wx.navigateTo({url: `${RECRUITER}position/jobList/jobList?type=confirm_chat`})
          //   // wx.setStorageSync('interviewChatLists', this.data.interviewInfos)
          // } else {
          //   confirmInterviewApi({id: interviewInfos.data[0].interviewId})
          //     .then(res => {
          //       this.triggerEvent('resultevent', res)
          //       wx.navigateTo({url: `${COMMON}arrangement/arrangement?id=${interviewInfos.data[0].interviewId}`})
          //     })
          // }
          break
        // 待求职者确认
        case 'iter-pedding':
          app.wxToast({title: '面试申请已发送'})
          break
        case 'recruiter-apply':
          app.wxToast({title: '面试申请已发送'})
          break
        case 'recruiter-arrangement':
          wx.navigateTo({url: `${COMMON}arrangement/arrangement?id=${interviewInfos.data[0].interviewId}`})
          break
        default:
          break
      }
    }
  }
})
