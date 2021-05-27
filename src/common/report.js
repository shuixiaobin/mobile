import axios from 'axios'

export const getReport = params => {
  return axios.get(`${WEBPACK_AJAX_BASE_URL}/pc/teacher/v1/share/practice/${params}`)
}

export const getWXshare = params => {
  return axios.get(`${WEBPACK_AJAX_BASE_URL}/interview/teacher/signInfo/`, { params })
}
