import { getLabelProfessionalSkillsApi, getFieldListApi } from '../../../../../../api/pages/label.js'

import {RECRUITER} from '../../../../../../config.js'
let app = getApp()
Page({
  data: {
    professionalSkills: [],
    skills: [],
    limitNum: 3
  },
  /**
   * @return   {[type]}     [description]
   */
  onClick(e) {
    const params = e.currentTarget.dataset.item
    let professionalSkills = this.data.professionalSkills
    let skills = professionalSkills.filter(field => field.active)
    if (!params.active && skills.length >= this.data.limitNum) {
      app.wxToast({title: '最多可选择3个领域'})
      return
    }
    professionalSkills.map(field => {
      if(field.labelId === params.labelId) field.active = !field.active
    })
    skills = professionalSkills.filter(field => field.active)
    this.setData({professionalSkills, skills})
  },
  onLoad(options) {
    this.getLabel(options)
  },
  getLabel (options) {
    if (options.target === '2') {
      getFieldListApi().then(response => {
        const professionalSkills = response.data
        let skills = wx.getStorageSync('fieldsData') || []
        skills.map((item, index) => {
          professionalSkills.map((n ,j) => {
            if (parseInt(item.fieldId) === n.labelId) {
              professionalSkills[j].active = true
            }
          })
        })
        this.setData({professionalSkills, skills})
      })
    } else {
      getLabelProfessionalSkillsApi().then(response => {
        const professionalSkills = response.data.labelProfessionalSkills
        this.setData({professionalSkills})
      })
    }
  },
  submit() {
    if (this.data.skills.length === 0) {
      app.wxToast({
        title: '请选择标签'
      })
      return
    }
    wx.setStorageSync('result', this.data.skills)
    wx.navigateBack({delta: 1})
  },
  onHide() {
    wx.remove            
     StorageSync('fieldsData')
  }
})