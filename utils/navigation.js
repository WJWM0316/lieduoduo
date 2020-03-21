import {RECRUITER, APPLICANT, COMMON} from '..//config.js'
const app = getApp()
const cdnImagePath = app.globalData.cdnImagePath
export const recruiterList = [
  {
    title: '首页',
    flag: 'index',
    iconPath: `${cdnImagePath}tab_home_nor@3x.png`,
    selectedIconPath: `${cdnImagePath}tab_home_sel@3x.png`,
    active: true,
    path: `${RECRUITER}index/index`
  },
  {
    title: '面试',
    flag: 'interview',
    iconPath: `${cdnImagePath}tab_interview_nor@3x.png`,
    selectedIconPath: `${cdnImagePath}tab_interview_sel@3x.png`,
    active: false,
    path: `${RECRUITER}interview/index/index`
  },
  {
    title: '职位管理',
    flag: 'position',
    iconPath: `${cdnImagePath}tab_job_nor@3x.png`,
    selectedIconPath: `${cdnImagePath}tab_job_sel@3x.png`,
    active: false,
    path: `${RECRUITER}position/index/index`
  },
  {
    title: '我的',
    flag: 'mine',
    iconPath: `${cdnImagePath}tab_me_nor@3x.png`,
    selectedIconPath: `${cdnImagePath}tab_me_sel@3x.png`,
    active: false,
    path: `${RECRUITER}user/mine/infos/infos`
  }
]
export const applicantList = [
  {
    title: '发现机会',
    flag: 'chance',
    iconPath: `${cdnImagePath}tab_job_nor@3x.png`,
    selectedIconPath: `${cdnImagePath}tab_job_sel@3x.png`,
    active: true,
    path: `${APPLICANT}index/index`,
    name: 'c_find_job'
  },
  {
    title: '动态',
    flag: 'dynamics',
    iconPath: `${cdnImagePath}tab_dynamics.png`,
    selectedIconPath: `${cdnImagePath}tab_dynamics_active.png`,
    active: false,
    path: `${APPLICANT}dynamics/dynamics`,
    name: 'c_dynamics'
  },
  {
    title: '名企高薪',
    flag: 'specialJob',
    iconPath: `${cdnImagePath}tab_24h.png`,
    selectedIconPath: `${cdnImagePath}tab_24h_pre.png`,
    active: false,
    path: `${APPLICANT}specialJob/specialJob`,
    name: 'c_specialJob'
  },
  {
    title: '面试',
    flag: 'interview',
    iconPath: `${cdnImagePath}tab_interview_nor@3x.png`,
    selectedIconPath: `${cdnImagePath}tab_interview_sel@3x.png`,
    active: false,
    path: `${APPLICANT}interview/interview/interview`,
    name: 'c_interview'
  },
  {
    title: '我的',
    flag: 'mine',
    iconPath: `${cdnImagePath}tab_me_nor@3x.png`,
    selectedIconPath: `${cdnImagePath}tab_me_sel@3x.png`,
    active: false,
    path: `${APPLICANT}center/mine/mine`,
    name: 'c_mine'
  }
]