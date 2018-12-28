import { getLabelProfessionalSkillsApi } from '../../../../../api/pages/label.js'

import {RECRUITER} from '../../../../../config.js'

Page({
  data: {
    professionalSkills: [],
    skills: []
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-25
   * @detail   选择职业类别
   * @return   {[type]}     [description]
   */
  onClick(e) {
    const params = e.currentTarget.dataset
    const result = this.data.professionalSkills.children.find(field => field.labelId === params.labelId)
    const skills = this.data.skills
    if(!skills.length) skills.push(result)
    const isExist = skills.every(field => field.labelId !== params.labelId)
    if(isExist) {
      skills.push(result)
      this.setData({skills})
    }
  },
  onLoad() {
    getLabelProfessionalSkillsApi()
      .then(response => {
        const storage = wx.getStorageSync('createPosition')
        const typeId = parseInt(storage.type)
        const professionalSkills = response.data.labelProfessionalSkills.find(field => field.labelId === typeId)
        this.setData({ professionalSkills, skills: storage.skills })
      })
  },
  submit() {
    wx.getStorage({
      key: 'createPosition',
      success: res => {
        const data = res.data
        data.skills = this.data.skills
        wx.setStorage({
          key: 'createPosition',
          data,
          success: () => {
             wx.navigateTo({url: `${RECRUITER}position/post/post`})
          }
        })
      }
    })
  }
})