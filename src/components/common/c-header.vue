<template>
    <div class="c_header">
        <div class="c_header_box">
            <span class="back" @click="back"></span>
                {{title}}
            <span class="menuIcon" @click="show"></span>
        </div>
        <ul class="page_list font30" v-show="showModel">
            <li v-for="item in pageList" :class="{menu_active: active_menu===item.icon}" @click="go(item.url)">
                <span :class="['page_icon',item.icon]"></span>
                {{item.name}}
            </li>
        </ul>
        <div class="page_model" @click="hide" v-show="showModel"></div>
    </div>
</template>

<script>
    export default {
        name: "c-header",
        props: ['active_menu','title'],  //当前选中的菜单 icon
        data(){
            return {
                pageList: [
                    {icon:'zhuye',name: '首页', url:'/'},
                    {icon:'sousuo',name: '搜索',url: '/wap/#/search'},
                    {icon:'zixun',name: '资讯', url: '/wap/#/other/informationList'},
                    {icon:'ziliao',name: '资料', url: '/wap/#/other/noteEssence'},
                    {icon:'kecheng',name: '课程', url: '/'},
                    {icon:'hyzx',name: '会员中心', url: '/wap/#/other/userCenter'},
                ],
                showModel: false
            }
        },
        methods:{
            go(url){
                window.location.href = url;
            },
            back(){
                //没有前向来源就跳回首页
                if(!document.referrer){
                    window.location.href = '/'
                }
                window.history.back();
            },
            show(){
                this.showModel = true;
                this.$emit('show')
            },
            hide(){
                this.showModel = false;
            }
        }
    }
</script>

<style scoped lang="less">
    .c_header{
        .c_header_box{
            width: 100%;
            height: 104px;
            line-height: 104px;
            background: #f66;
            position: fixed;
            z-index: 15;
            text-align: center;
            color: #fff;
            font-weight: 600;
            font-size: 40px; /* px */
            .back{
                content: '';
                display: inline-block;
                width: 41px;
                height: 41px;
                background: url("../../assets/arrowleft.png") no-repeat;
                -webkit-background-size: 41px;
                background-size: 41px;
                position: absolute;
                top: 31px;
                left: 35px;
            }
            .menuIcon{
                content: '';
                display: inline-block;
                width: 41px;
                height: 41px;
                background: url("../../assets/pagelist.png") no-repeat;
                -webkit-background-size: 41px;
                background-size: 41px;
                position: absolute;
                top: 31px;
                right: 35px;
            }
        }
        .page_list{
            position: fixed;
            z-index: 15;
            top: 104px;
            width: 100%;
            li{
                position: relative;
                height: 97px;
                background-color: #fff;
                color: #333;
                line-height: 97px;
                border-bottom: 1px solid #e0e0e0; /* no */
                padding-left: 67px;
                .page_icon{
                    display: inline-block;
                    width: 27px;
                    height: 27px;
                    position: absolute;
                    left: 25px;
                    top: 35px;
                    -webkit-background-size: 30px;
                    background-size: 30px;
                    background-position: 0 0;
                }
                .zhuye{
                    background: url('../../assets/zhuye_icon.png') no-repeat 0 0;
                    -webkit-background-size: 54px;
                    background-size: 54px;
                }
                .sousuo{
                    background: url('../../assets/sousuo_icon.png') no-repeat 0 0;
                    -webkit-background-size: 54px;
                    background-size: 54px;
                }
                .zixun{
                    background: url('../../assets/zixun_icon.png') no-repeat 0 0;
                    -webkit-background-size: 54px;
                    background-size: 54px;
                }
                .ziliao{
                    background: url('../../assets/ziliao_icon.png') no-repeat 0 0;
                    -webkit-background-size: 54px;
                    background-size: 54px;
                }.kecheng{
                     background: url('../../assets/kecheng_icon.png') no-repeat 0 0;
                     -webkit-background-size: 54px;
                     background-size: 54px;
                 }
                .hyzx{
                    background: url('../../assets/yonghu_icon.png') no-repeat 0 0;
                    -webkit-background-size: 54px;
                    background-size: 54px;
                }
            }
            .menu_active{
                color: #f66;
                .page_icon{
                    background-position: -27px 0;
                }
            }
        }
        .page_model{
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 11;
            background-color: rgba(0,0,0,.2);
        }
    }
</style>