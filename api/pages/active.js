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
/* 总榜单 */
export const getRankApi = (data) => {
  return request({
    method: 'get',
    url: '/rank/',
    data
  })
}
/* 职位榜单 */
export const getOfficeRankApi = (data) => {
  return request({
    method: 'get',
    url: '/rank/cateRank',
    data
  })
}
/* 城市榜单 */
export const getCityRankApi = (data) => {
  return request({
    method: 'get',
    url: '/rank/cityRank',
    data
  })
}
/* 浏览过的用户或招聘官信息 */
export const geMyBrowseUsersApi = (data) => {
  return request({
    method: 'get',
    url: '/browse/myBrowseUsers',
    data
  })
}
