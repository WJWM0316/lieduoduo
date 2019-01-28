import {
  deleteBrowseUserApi
} from '../../../api/pages/browse.js'

import {deleteMyCollectUserApi} from "../../../api/pages/collect.js"

const app = getApp()

Component({
  properties: {
    list:{
      type: Array,
      default: []
    },
    showSlideView: {
      type: Boolean,
      value: false
    },
    buttonType: {
      type: String,
      value: 'delete'
    }
  },
  data: {

  },
  methods: {
    routeJump (e) {
      const uid = e.currentTarget.dataset.uid
      wx.navigateTo({
        url: `/page/common/pages/recruiterDetail/recruiterDetail?uid=${uid}`
      })
    },
    /**
     * @Author   小书包
     * @DateTime 2019-01-23
     * @detail   删除记录
     * @return   {[type]}     [description]
     */
    delete(e) {
      const params = e.currentTarget.dataset
      app.wxConfirm({
        title: '删除该记录',
        content: '确定删除该条浏览记录？',
        confirmBack: () => {
          let list = this.data.list
          list = list.filter(field => field.uid !== params.uid)
          this.setData({list})
          console.log(list, params)
          // this.triggerEvent('refreshevent', {uid})
          // deleteBrowseUserApi({uid}).then(res => {
          //   this.triggerEvent('refreshevent', {uid})
          // })
        }
      })
    },
    /**
     * @Author   小书包
     * @DateTime 2019-01-23
     * @detail   不感兴趣
     * @return   {[type]}     [description]
     */
    unsubscribe(e) {
      const uid = e.currentTarget.dataset.uid
      app.wxConfirm({
        title: '不再对该招聘官感兴趣',
        content: '确定取消对该招聘官感兴趣？',
        confirmBack: () => {
          deleteMyCollectUserApi({uid}).then(res => {
            this.triggerEvent('refreshevent', {uid})
          })
        }
      })
    }
  }
})
