// components/functional/unloadFile/unloadFile.js
import {unloadApi} from '../../../api/pages/common.js'
import {baseHost} from '../../../config.js'
let fileNum = 0 // 选择文件的数量
let result = [] // 返回父组件的结果
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    unloadType: {
      type: String,
      value: 'img'
    },
    url: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    unloadFile() {
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.setData({url: res.tempFiles[0].path})
          fileNum = res.tempFiles.length
          wx.showLoading({
            title: '上传中...',
            mask: true
          })
          res.tempFiles.forEach((item) => {
            this.wxupLoad(item)
          })
        },
        fail: (err) => {
          console.log('wx.chooseImage发神经了', err)
        }
      })
    },
    wxupLoad(file) {
      wx.uploadFile({
        url: `${baseHost}/attaches`,
        filePath: file.path,//此处为图片的path
        methos: 'post',
        name:"file",
        header: {
          'Authorization': wx.getStorageSync('token')
        }, 
        // 设置请求的 header
        formData: {
          'img1': file.path,
          'attach_type': this.data.unloadType,
          'size': file.size
        }, 
        complete: (res) => {
          if (res.statusCode === 200) {
            console.log(res, "上传成功")
            result.push(JSON.parse(res.data).data[0])
          } else {
            console.log(res, "上传失败")
          }
          fileNum--
          if (fileNum === 0) {
            wx.hideLoading()
            this.triggerEvent('resultEvent', result)
          }
        }
      })
    }
  }
})
