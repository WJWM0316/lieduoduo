/* 首页用户浏览 及 招聘官动态接口 */
import { request } from '../require.js'
/* 浏览过我的招聘官接口 */
export const getBrowseMySelfApi = (data) => {
  return request({
    method: 'get',
    url: '/browse/browseMySelf',
    data
  })
}
/* 收藏我的招聘官列表 */
export const getCollectMySelfApi = (data) => {
  return request({
    method: 'get',
    url: '/collect/getCollectMySelf',
    data
  })
}
/* 我感兴趣的招聘官列表 */
export const getMyBrowseUsersApi = (data) => {
  return request({
    method: 'get',
    url: '/browse/myBrowseUsers',
    data
  })
}