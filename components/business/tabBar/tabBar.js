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
        title: '首页',
        icon: '',
        selectIcon: '',
        active: true,
        iconfont: 'icon-shouye',
        path: `${RECRUITER}index/index`
      },
      {
        title: '面试',
        icon: '',
        selectIcon: '',
        active: false,
        iconfont: 'icon-mianshi',
        path: `${RECRUITER}interview/interview`
      },
      {
        title: '职位管理',
        icon: '',
        selectIcon: '',
        active: false,
        iconfont: 'icon-zhiyejihui',
        path: `${RECRUITER}officeManager/officeManager`
      },
      {
        title: '我的',
        icon: '',
        selectIcon: '',
        active: false,
        iconfont: 'icon-wode',
        path: `${RECRUITER}mine/mine`
      }
    ],
    url: ''
  },
  attached() {
    const list = this.data.tabType === 0 ? this.data.list0 : this.data.list1
    const currentRoute = '/' + getCurrentPages()[0].route
    list.map(field => field.active = field.path === currentRoute ? true : false)
    this.setData({ list })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    toggle(e) {
      wx.redirectTo({ url: e.target.dataset.path })
    }
  }

})
