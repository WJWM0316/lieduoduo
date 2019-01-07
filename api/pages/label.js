import { request } from '../require.js'

export const getLabelPositionApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/label/position',
    data,
    hasLoading: true
  })
}

export const getLabelProfessionalSkillsApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/label/professionalSkills?type=skills',
    data,
    hasLoading: true
  })
}