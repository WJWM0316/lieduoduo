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
    vkey: {
      type: String,
      value: ''
    },
    positionId: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    interviewInfos: {},
    identity: wx.getStorageSync('choseType'), // 身份标识
    slogoIndex: 0,
    // 是否是我发布
    isOwerner: false,
    slogoList: [
      {
        id: 1,
        text: '工作不易，知音难觅，壮士约乎？工作不易，知音难觅，壮士约乎？'
      },
      {
        id: 1,
        text: '细节决定成败，态度决定一切。'
      },
      {
        id: 1,
        text: '彩虹风雨后，成功细节中。'
      },
      {
        id: 1,
        text: '态度决定一切，习惯成就未来。'
      }
    ]
  },
  ready() {
    this.setData({slogoIndex: this.getRandom()})
    this.getInterviewStatus()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getRandom() {
      return Math.floor(Math.random() * this.data.slogoList.length + 1)
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
          this.setData({interviewInfos: res.data})
          if(res.code === 204) this.setData({isOwerner: true})
        })
    },
    /**
     * @Author   小书包
     * @DateTime 2019-01-02
     * @detail   待办项
     * @return   {[type]}     [description]
     */
    todoAction(e) {
      const type = e.currentTarget.dataset.type
      switch(type) {
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
        case 'chat1':
          // applyInterviewApi({recruiterUid: 90, positionId: 39})
          applyInterviewApi({recruiterUid: this.data.infos.recruiterInfo.uid, positionId: this.data.infos.id})
            .then(res => {
              this.getInterviewStatus()
              app.wxToast({title: '面试申请已发送'})
              // this.triggerEvent('resultevent', res)
            })
          break
        case 'chat2':
          app.wxToast({title: '等待面试官处理'})
          break
        case 'chat3':
          app.wxToast({title: '等待招聘官安排面试'})
          break
        case 'accept':
          confirmInterviewApi({id: this.data.interviewInfos.data[0][0].interviewId})
            .then(() => {
              app.wxToast({title: '已接受约面'})
            })
          break
        case 'reject':
          app.wxConfirm({
            title: '暂不考虑该职位',
            content: '确定暂不考虑后，招聘官将终止这次约面流程',
            showCancel: true,
            cancelText: '我再想想',
            confirmText: '确定',
            cancelColor: '#BCBCBC',
            confirmColor: '#652791',
            confirmBack: () => {
              refuseInterviewApi()
            }
          })
          break
        case 'edit':
          wx.navigateTo({url: `${RECRUITER}position/post/post?positionId=${this.data.infos.id}`})
          break
        case 'detail':
          wx.navigateTo({url: `${COMMON}arrangement/arrangement?id=${this.data.interviewInfos.data[0].interviewId}`})
          break
        case 'about':
          wx.navigateTo({url: `${COMMON}homepage/homepage?companyId=${this.data.infos.companyId}`})
          break
        default:
          break
      }
    }
  }
})
