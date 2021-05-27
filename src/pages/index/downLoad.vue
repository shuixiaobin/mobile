<template>
    <div class="down_load">
        <span class="down_icon"></span>
        <div class="down_btn font32" @click="downLoad">下载</div>
    </div>
</template>

<script>
    export default {
        name: "downLoad",
        methods: {
            downLoad(){
                // let u = navigator.userAgent;
                // let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
                // let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                // if (isIOS) {
                //     window.location.href = 'https://itunes.apple.com/cn/app/id940376535?mt=8'
                // }else {
                //     window.location.href = 'http://upload.htexam.com/appAndroid/app-release-vhuatu.apk';
                // }
                window.location.href = 'http://ns.huatu.com/h5/'
            }
        }
    }
</script>

<style scoped lang="less">
    .down_load{
        width: 100%;
        height: 100px;
        background-color: #fff;
        border-radius: 16px 16px 0 0;
        position: fixed;
        bottom: 0;
        box-shadow: 0 -3px 3px rgba(0,0,0,.1);
        .down_icon{
            display: inline-block;
            width: 232px;
            height: 72px;
            background: url("../../assets/app_logo.png") no-repeat;
            -webkit-background-size: 232px;
            background-size: 232px;
            margin: 14px 30px;
        }
        .down_btn{
            display: inline-block;
            float: right;
            width: 200px;
            height: 60px;
            background: linear-gradient(45deg,rgba(255,95,92,1) 0%,rgba(255,152,105,1) 100%);
            margin: 20px 30px;
            border-radius: 8px;
            color: #fff;
            font-weight: 600;
            line-height: 60px;
            text-align: center;
        }
    }
</style>