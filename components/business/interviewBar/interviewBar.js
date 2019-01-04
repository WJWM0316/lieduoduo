import {
  applyInterviewApi
} from '../../../api/pages/interview.js'

import {
  getPositionApi,
  openPositionApi,
  closePositionApi
} from '../../../api/pages/position.js'

import {RECRUITER, COMMON} from '../../../config.js'

Component({
  properties: {
    infos: {
      type: Object,
      value: {}
    },
    isOwner: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    identity: wx.getStorageSync('choseType'), // 身份标识
    slogoIndex: 0,
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
        case 'chat':
          // applyInterviewApi({recruiterUid: 90, positionId: 39})
          applyInterviewApi({recruiterUid: this.data.infos.recruiterInfo.uid, positionId: this.data.infos.id})
            .then(res => {
              this.triggerEvent('resultevent', res)
            })
          break
        case 'edit':
          wx.navigateTo({url: `${RECRUITER}position/post/post?positionId=${this.data.infos.id}`})
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
