import { RECRUITER } from '../config.js'

export const recruiterJump = (msg) => {
  let companyInfo = msg.data.companyInfo
  let identityInfo = msg.data.identityInfo
  let applyJoin = msg.data.applyJoin

  if(applyJoin) {
    // 加入公司
    wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=join`})
  } else {

    // 还没有创建公司信息
    if(!companyInfo.id) {
      wx.reLaunch({url: `${RECRUITER}user/company/apply/apply`})
    } else {

      // 创建公司第一步
      if(!companyInfo.step) {
        wx.reLaunch({url: `${RECRUITER}user/company/createdCompanyInfos/createdCompanyInfos`})
      } else {
        // 创建公司 没填身份证 但是公司已经审核通过
        if(companyInfo.status === 1 && !identityInfo.id) {
          wx.reLaunch({url: `${RECRUITER}user/company/identity/identity?from=identity`})
          return;
        }
        // 创建公司 已填身份证 身份证没通过 公司已经审核通过
        if(companyInfo.status === 1 && identityInfo.id && identityInfo.status === 2) {
          wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=identity`})
          return;
        }
        
        wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=company`})
      }
    }
  }
}