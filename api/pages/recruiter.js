// 招聘管首页
import { request } from '../require'

// 浏览过的招聘官列表
export const getMyBrowseUsersApi = data => {
  return request({
    method: 'get',
    url: '/browse/myBrowseUsers',
    data,
    isLoadData: true
  })
}