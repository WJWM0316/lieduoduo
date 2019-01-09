import { getLabelProfessionalSkillsApi } from '../../../../../api/pages/label.js'

import {RECRUITER} from '../../../../../config.js'

Page({
  data: {
    professionalSkills: [],
    skills: [],
    limitNum: 4
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-09
   * @detail   获取选中的item
   * @return   {[type]}   [description]
   */
  getActive() {
    const professionalSkills = this.data.professionalSkills.filter(field => field.active)
    this.setData({skills: professionalSkills})
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-25
   * @detail   选择职业类别
   * @return   {[type]}     [description]
   */
  onClick(e) {
    const params = e.currentTarget.dataset
    let professionalSkills = this.data.professionalSkills
    let tem = professionalSkills.filter(field => field.active)
    if(tem.length < this.data.limitNum) {
      professionalSkills.map(field => {
        if(field.labelId === params.labelId) field.active = !field.active
      })
    } else {
      professionalSkills.map(field => {
        if(field.labelId === params.labelId) field.active = false
      })
    }
    this.setData({professionalSkills})
    this.getActive()
  },
  onLoad() {
    getLabelProfessionalSkillsApi()
      .then(response => {
        const storage = wx.getStorageSync('createPosition')
        const typeId = parseInt(storage.parentType)
        const professionalSkills = response.data.labelProfessionalSkills.find(field => field.labelId === typeId).children
        const temLabelId = storage.skills.map(field => field.labelId)
        if(temLabelId.length) {
          professionalSkills.map(field => field.active = temLabelId.includes(field.labelId) ? true : false)
        } else {
          professionalSkills.map(field => field.active = false)
        }
        this.setData({professionalSkills, skills: storage.skills})
      })
  },
  submit() {
    const storage = wx.getStorageSync('createPosition')
    storage.skills = this.data.skills
    wx.setStorageSync('createPosition', storage)
    wx.redirectTo({url: `${RECRUITER}position/post/post`})
  }
})