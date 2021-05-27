import axios from 'axios'

export const getAudioList = params => {
  return axios.get(
    `${WEBPACK_PHP_BASE_URL}/lumenapi/v5/c/syllabus/share_audio_syllabus`,
    {
      params
    }
  )
}

export const getWXshare = params => {
  return axios.get(
    `${WEBPACK_PHP_BASE_URL}/lumenapi/v5/c/order/share_wechat_signature`,
    {
      params
    }
  )
}
