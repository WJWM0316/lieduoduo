// 通用接口api
import { request, upload } from './require'

/**
 * 获取上传配置信息
 * @param {*} data { file_type } file_type：image:图片,audio:音频,video:视频,file:文件
 */
export const getUploadFileConfig = data => request({
  url: '/files/getUploadFileConfig',
  isLoading: false,
  data
})

/**
 * 上传文件到oss服务器
 * @param {*} filePath 微信临时文件路径，只能是一个
 * @param {*} data oss上传配置对象集
 */
export const uploadFileToOSS = (filePath, data, setting) => {
  console.log('filePath', filePath)
  const { ossConfig, systemConfig } = data
  return upload({
    url: ossConfig.host,
    data: {
      key: `${ossConfig.dir}${systemConfig.fileName}.${systemConfig.suffix}`,
      policy: ossConfig.policy,
      OSSAccessKeyId: ossConfig.accessid,
      success_action_status: '200',
      callback: ossConfig.callback,
      signature: ossConfig.signature,
    },
    filePath,
    setting
  })
}

// send fromId
export const sendFromIdApi = (data) => {
  return request({
    method: 'post',
    url: '/commom/saveFormId',
    data,
    isLoading: false
  })
}


