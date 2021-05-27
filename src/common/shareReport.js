import { getWXshare } from './report.js'
import wx from 'weixin-js-sdk'

export async function initWeiXin(info) {
  let param = encodeURIComponent(location.href.split('#')[0])//encodeURIComponent(location.href.split('#')[0])
  try {
    let data = await getWXshare({ url: param })
    let res = data.data
    wx.config({
      debug: false, // 开启调试模式为true后可以通过alert弹窗将公众号签名等结果反馈出
      appId: res.appId, // 必填，公众号的唯一标识
      timestamp: res.timestamp, // 必填，生成签名的时间戳
      nonceStr: res.nonceStr, // 必填，生成签名的随机串
      signature: res.signature, // 必填，签名，见附录1
      jsApiList: [
        'updateAppMessageShareData',
        'updateTimelineShareData',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareQZone'
      ]
    })
  } catch (e) {
    console.log(e)
  }
  wx.ready(function() {
    //自定义“分享给朋友”及“分享到QQ”按钮的分享内容
    wx.updateAppMessageShareData({
      title: info.title, // 分享标题
      desc: info.desc, // 分享描述
      link: info.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: info.imgUrl, // 分享图标
      error: function(data) {
        console.log(data)
      }
    })
    //自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
    wx.updateTimelineShareData({
      title: info.title, // 分享标题
      link: info.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: info.imgUrl, // 分享图标
      error: function(data) {
        console.log(data)
      }
    })
    //获取“分享到朋友圈”按钮点击状态及自定义分享内容接口（即将废弃）
    wx.onMenuShareTimeline({
      title: info.title, // 分享标题
      link: info.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: info.imgUrl, // 分享图标
      error: function(data) {
        console.log(data)
      }
    })
    //获取“分享给朋友”按钮点击状态及自定义分享内容接口（即将废弃）
    wx.onMenuShareAppMessage({
      title: info.title, // 分享标题
      desc: info.desc, // 分享描述
      link: info.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: info.imgUrl, // 分享图标
      type: 'link', // 分享类型,music、video或link，不填默认为link
      dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
      error: function(data) {
        console.log(data)
      }
    })
    //获取“分享到QQ”按钮点击状态及自定义分享内容接口（即将废弃）
    wx.onMenuShareQQ({
      title: info.title, // 分享标题
      desc: info.desc, // 分享描述
      link: info.link, // 分享链接
      imgUrl: info.imgUrl // 分享图标
    })
    //获取“分享到QQ空间”按钮点击状态及自定义分享内容接口（即将废弃）
    wx.onMenuShareQZone({
      title: info.title, // 分享标题
      desc: info.desc, // 分享描述
      link: info.link, // 分享链接
      imgUrl: info.imgUrl // 分享图标
    })
  })
}
