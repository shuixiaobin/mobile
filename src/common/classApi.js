import { myGet, myPost } from './requestApi'
import axios from 'axios'

// 获取课程详情
export const classDetail = params => {
  return myGet('/c/v6/courses/classInfo', params, {
    cv: '1.0.0',
    terminal: 7,
    token: ''
  })
}
// 获取课程说明h5
export const getClassExt = classId => {
  return axios.get(
    `${WEBPACK_AJAX_BASE_URL}/c/v5/courses/${classId}/getClassExt`
  )
}

// 获取老师列表
export const getTeacherList = classId => {
  return myGet(`/c/v5/courses/${classId}/getCourseTeacherInfo`)
}

// 获取课程大纲
export const getOutline = params => {
  return myGet(`/c/v5/courses/${params.classId}/classSyllabusWithoutSession`, {
    parentId: params.parentId,
    page: params.page
  })
}

// 获取试听列表
export const getAuditionList = classId => {
  return myGet(
    `/c/v5/courses/${classId}/classAuditionList`,
    {},
    {
      cv: '1.0.0',
      terminal: 7,
      token: ''
    }
  )
}
