import api from './api'
import wx from 'weixin-js-sdk'

const imgUrl = 'http://p.htwx.net/images/share_logo.png';
export default async function(info){
    let title = '';
    if(info){
        title = `邀你参加${info.category}-${info.subject}万人模考大赛`;
    }
    let param = encodeURIComponent(location.href.split('#')[0]);
    let data = await api.wxShare(param).catch(e=>{
        //服务code冲突，避免更多麻烦，在这里处理
        if(e.data&&e.data.code===10000){
            let data = e.data.data;
            wx.config({
                debug: false,
                appId: data.appId,
                timestamp: data.timestamp,
                nonceStr: data.nonceStr,
                signature: data.signature,
                jsApiList: [
                    'updateAppMessageShareData',
                    'updateTimelineShareData',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareTimeline',
                    'onMenuShareQZone'
                ]
            })
        }
    })
    wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
        // “分享给朋友”及“分享到QQ”按钮
        wx.updateAppMessageShareData({
            title, // 分享标题
            desc: '华图在线，过关才是硬道理！', // 分享描述
            link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: imgUrl, // 分享图标
            success: function () {
                // 设置成功
            }
        })

        //QQ空间及朋友圈
        wx.updateTimelineShareData({
            title, // 分享标题
            link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: imgUrl, // 分享图标
            success: function () {
                // 设置成功
            }
        })
    });
}