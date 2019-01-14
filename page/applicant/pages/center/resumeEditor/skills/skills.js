import { getLabelProfessionalSkillsApi, getFieldListApi } from '../../../../../../api/pages/label.js'

import {RECRUITER} from '../../../../../../config.js'

Page({
  data: {
    professionalSkills: [],
    skills: [],
    limitNum: 4
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
    let skills = professionalSkills.filter(field => field.active)
    this.setData({professionalSkills, skills})
  },
  onLoad(options) {
    this.getLabel(options)
      .then(response => {
        const professionalSkills = response.data.labelProfessionalSkills
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
    wx.setStorageSync('result', this.data.skills)
    wx.navigateBack({delta: 1})
  }
})