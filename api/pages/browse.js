import { request } from '../require.js'

// 浏览过的招聘官列表
export const getMyBrowseUsersListApi = (data) => {
  return request({
    url: '/browse/myBrowseUsers',
    method: 'get',
    data,
    hasLoading: true
  })
}

// 浏览过的职位列表
export const getMyBrowsePositionApi = (data) => {
  return request({
    url: '/browse/myBrowsePosition',
    method: 'get',
    data,
    hasLoading: true
  })
}

// 浏览过我的招聘官
export const getBrowseMySelfApi = (data) => {
  return request({
    url: '/browse/browseMySelf',
    method: 'get',
    data,
    hasLoading: true
  })
}