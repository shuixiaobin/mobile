import { getWXshare } from './audio'
import wx from 'weixin-js-sdk'

export async function initWeiXin(info) {
  let param = encodeURIComponent(location.href.split('#')[0])
  try {
    let data = await getWXshare({ url: param })
    let res = data.data.data
    wx.config({
      debug: false,
      appId: res.appId,
      timestamp: res.timestamp,
      nonceStr: res.nonceStr,
      signature: res.signature,
      jsApiList: [
        'updateAppMessageShareData',
        'updateTimelineShareData',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareTimeline',
        'onMenuShareQZone'
      ]
    })
  } catch (e) {
    console.log(e)
  }
  wx.ready(function() {
    wx.onMenuShareAppMessage({
      title: info.title, // 分享标题
      desc: info.desc, // 分享描述
      link: info.link, // 分享链接
      imgUrl: info.imgUrl, // 分享图标
      error: function(data) {
        console.log(data)
      }
    })
    wx.onMenuShareTimeline({
      title: info.title, // 分享标题
      desc: info.desc, // 分享描述
      link: info.link, // 分享链接
      imgUrl: info.imgUrl, // 分享图标
      error: function(data) {
        console.log(data)
      }
    })
    wx.onMenuShareQQ({
      title: info.title, // 分享标题
      desc: info.desc, // 分享描述
      link: info.link, // 分享链接
      imgUrl: info.imgUrl, // 分享图标
      error: function(data) {
        console.log(data)
      }
    })
  })
}
