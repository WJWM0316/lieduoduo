import {
  RECRUITER, 
  COMMON, 
  APPLICANT, 
  DOWNLOADAPPPATH
} from '../../../config.js'

Component({
  properties: {
    className: {
      type: String,
      value: 'style1'
    }
  },
  methods: {
    jump() {
      wx.navigateTo({
        url: DOWNLOADAPPPATH
      })
    }
  }
})
