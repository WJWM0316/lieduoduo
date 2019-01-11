import { getLabelProfessionalSkillsApi, getFieldListApi } from '../../../../../../api/pages/label.js'

import {RECRUITER} from '../../../../../../config.js'

Page({
  data: {
    professionalSkills: [],
    skills: [],
    limitNum: 4
  },
  /**
   * @return   {[type]}   [description]
   */
  getActive() {
    const professionalSkills = this.data.professionalSkills.filter(field => field.active)
    this.setData({skills: professionalSkills})
  },
  /**
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
  onLoad(options) {
    this.getLabel(options)
      .then(response => {
//      const storage = wx.getStorageSync('createPosition')
//      const typeId = parseInt(storage.parentType)
        const professionalSkills = response.data.labelProfessionalSkills
//      const professionalSkills = response.data.labelProfessionalSkills.find(field => field.labelId === typeId).children
//      const temLabelId = storage.skills.map(field => field.labelId)
//      if(temLabelId.length) {
//        professionalSkills.map(field => field.active = temLabelId.includes(field.labelId) ? true : false)
//      } else {
//        professionalSkills.map(field => field.active = false)
//      }
//      this.setData({professionalSkills, skills: storage.skills})
        this.setData({professionalSkills})
      })
  },
  getLabel (options) {
    if (options.target === '2') {
      getFieldListApi().then(response => {
        const professionalSkills = response.data
        this.setData({professionalSkills})
      })
    } else {
      getLabelProfessionalSkillsApi().then(response => {
        const professionalSkills = response.data.labelProfessionalSkills
        this.setData({professionalSkills})
      })
    }
  },
  submit() {
//  const storage = wx.getStorageSync('createPosition')
//  storage.skills = this.data.skills
    wx.setStorageSync('result', this.data.skills)
    console.log(this.data.skills, 777)
    wx.navigateBack({delta: 1})
  }
})