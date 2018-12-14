// components/business/tabBar/tabBar.js
import {RECRUITER, APPLICANT} from '../../../config.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabType: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [],
    list0: [
      {
        title: '首页',
        icon: '',
        selectIcon: '',
        path: `${APPLICANT}index/index`
      },
      {
        title: '首页1',
        icon: '',
        selectIcon: '',
        path: `${APPLICANT}index/index`
      },
      {
        title: '首页2',
        icon: '',
        selectIcon: '',
        path: `${APPLICANT}index/index`
      },
      {
        title: '首页3',
        icon: '',
        selectIcon: '',
        path: `${APPLICANT}index/index`
      }
    ],
    list1: [
      {
        title: '首页4',
        icon: '',
        selectIcon: '',
        path: `${RECRUITER}index/index`
      },
      {
        title: '首页5',
        icon: '',
        selectIcon: '',
        path: `${RECRUITER}index/index`
      },
      {
        title: '首页6',
        icon: '',
        selectIcon: '',
        path: `${RECRUITER}index/index`
      },
      {
        title: '首页7',
        icon: '',
        selectIcon: '',
        path: `${RECRUITER}index/index`
      }
    ]
  },
  attached: function () {
    if (this.data.tabType === 0) {
      this.setData({
        list: this.data.list0
      })
    } else {
      this.setData({
        list: this.data.list1
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    toggle (e) {
      wx.redirectTo({
        url: e.target.dataset.path
      })
    }
  }

})