<template>
    <div class="select_box">
        <div class="top1">
            <div class="subject_select font30" :class="{subject_select_active:showCate}" @click="handleClick(true)">
                <span class="name">{{cur_category.name}}</span>
            </div>
            <div class="subject_select font30" :class="{subject_select_active:showSubject}" @click="handleClick(false)">
                <span class="name">{{cur_subject.name}}</span>
            </div>
        </div>
        <div class="select_list" v-if="showCate">
            <span :class="['select_item',{'select_item_active': cur_category.id===item.id}]"
                  @click="chooseCategory(item)"
                  v-for="item in categoryList">{{item.name}}
            </span>
        </div>
        <div class="select_list" v-if="showSubject&&cur_category">
            <span :class="['select_item',{'select_item_active': cur_subject.id===item.id}]"
                  @click="chooseSubject(item)"
                  v-for="item in cur_category.children">{{item.name}}</span>
        </div>
        <div class="model"  @click="close" v-if="showSubject||showCate"></div>
    </div>
</template>

<script>
    import api from '../../common/api'
    export default {
        name: "select-header",
        props: ['hideSelect'],
        data(){
            return {
                cur_category: '',
                cur_subject: '',
                categoryList: null,
                showCate: false,
                showSubject: false,
                modelList: [],
                page: 1
            }
        },
        watch:{
            cur_subject(val){
                this.$emit('change',val.id,{
                    category: this.cur_category?this.cur_category.name:'',
                    subject: val.name
                })
            },
            hideSelect(){
                //监听一个随机值，变化时表示需要隐藏选择器
                this.close()
            }
        },
        methods: {
            handleClick(flag){
                if(flag){
                    this.showCate = !this.showCate;
                    this.showSubject = false
                }else{
                    this.showSubject = !this.showSubject;
                    this.showCate = false
                }
            },
            //选择类别
            chooseCategory(val){
                this.cur_category = val;
                this.cur_subject = val.children[0];
                this.$router.replace({path: `./index.html?subjectId=${this.cur_subject.id}&categoryId=${this.cur_category.id}${this.$route.query.code?`&code=${this.$route.query.code}`:''}`})
                this.close();
            },
            chooseSubject(val){
                this.cur_subject = val;
                this.$router.replace({path: `./index.html?subjectId=${val.id}&categoryId=${this.cur_category.id}${this.$route.query.code?`&code=${this.$route.query.code}`:''}`})
                this.close();
            },
            //获取学科
            async getCategory(){
                let params = {
                    terminal: 7
                }
                let data = await api.getCategory(params);
                if(data) this.categoryList = data.data.data;
                if(this.categoryList&&this.categoryList.length>0){
                    if(this.$route.query&&this.$route.query.subjectId&&this.$route.query.categoryId){
                        let flag1 = this.categoryList.some(item=>{
                            if(item.id==this.$route.query.categoryId){
                                this.cur_category = item;
                                let flag2 = this.cur_category.children.some(child=>{
                                    if(child.id==this.$route.query.subjectId){
                                        this.cur_subject = child;
                                        return true
                                    }
                                });
                                if(!flag2){
                                    this.cur_subject = this.cur_category.children[0]
                                }
                                return true
                            }
                            return false
                        })
                        if(!flag1){
                            this.chooseCategory(this.categoryList[0])
                        }
                    }else{
                        this.chooseCategory(this.categoryList[0])

                    }
                }
            },
            //关闭选择
            close(){
                this.showCate = false;
                this.showSubject = false;
            },
        },
        created(){
            this.getCategory()
        }
    }
</script>

<style scoped lang="less">
    .select_box{
        position: fixed;
        z-index: 10;
        top: 104px;
        height: 72px;
        width: 100%;
        .top1{
            position: absolute;
            width: 100%;
            height: 72px;
            z-index: 10;
            .subject_select{
                width: 50%;
                height: 72px;
                float: left;
                padding: 16px 0;
                text-align: center;
                box-sizing: border-box;
                background-color: #fff;
                color: #666;
                border-bottom: 1px solid #ddd;/*no*/
                .name{
                    display: inline-block;
                    width: 100%;
                    height: 40px;
                    &:after{
                        display: inline-block;
                        content: '';
                        border-top: 10px solid #666;
                        border-left: 10px solid transparent;
                        border-right: 10px solid transparent;
                        margin-left: 10px;
                        vertical-align: middle;
                    }
                }
                &:first-child{
                    .name{
                        border-right: 1px solid #dbdbdb;
                    }
                }
            }
            .subject_select_active{
                background-color: #efefef;
                .name{
                    color: #f66;
                    &:after{
                        border-top: none;
                        border-bottom: 10px solid #f66;
                    }
                }
                &:first-child{
                    .name{
                        border-right: none;
                    }
                }
            }
        }
        .select_list{
            position: fixed;
            top: 176px;
            left: 0;
            z-index: 9;
            width: 100%;
            height: auto;
            padding: 25px 40px 5px;
            background: #ededed;
            .select_item{
                display: inline-block;
                padding: 8px 15px;
                background-color: #fff;
                margin: 0 25px 25px 0;
                color: #666;
            }
            .select_item_active{
                color: #f66;
            }
        }
        .model{
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 8;
            background: #000;
            opacity: .6;
        }
    }
</style>