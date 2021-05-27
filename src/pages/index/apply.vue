<template>
    <div class="apply" v-show="showSelect" @touchmove.prevent>
        <div class="apply_box">
            <span class="close" @click="close"></span>
            <div class="apply_title font32">填写报考信息</div>
            <div class="apply_des font28">可获得更精准的模考报告</div>
            <div class="selectArea">
                {{examType == 1 ? '机构性质':'报考区域'}}
                <select @blur="handleBlur" v-model="cur_city" class="select font24" style="-webkit-appearance: none">
                    <option value="" disabled>请选择{{examType == 1 ? '机构性质':'报考区域'}}</option>
                    <option :value="item" v-for="(item,i) in area" :key="i">{{item.value}}</option>
                </select>
            </div>
            <div class="apply_btn" @click="apply">确认报名</div>
        </div>
    </div>
</template>

<script>
    import Util from '../../common/util'
    export default {
        name: "apply",
        props: ['area','showSelect', 'examType', 'chooseArea'],
        data(){
            return {
                cur_city: this.chooseArea || {}
            }
        },
        methods: {
            apply: Util.debounce(function(){
                if(!this.cur_city.value){
                    this.Toast(
                        {
                            message: '请选择完整信息',
                            duration: 2000,
                            className: 'my_toast'
                        })
                    return
                }
                
                this.$emit('apply',this.cur_city)
            },500),
            //关闭弹窗
            close(){
                this.$emit('update:showSelect',false)
            },
			handleBlur(){
            	setTimeout(_=>{
					if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //判断iPhone|iPad|iPod|iOS
						document.activeElement.scrollIntoViewIfNeeded(true);
					}

                },100)
            }
        }
    }
</script>

<style scoped lang="less">
    .apply{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 20;
        background: rgba(0,0,0,.55);
        padding: 0 55px;
        .apply_box{
            width: 650px;
            height: 380px;
            background: #fff;
            -webkit-border-radius: 16px;
            -moz-border-radius: 16px;
            border-radius: 16px;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            .close{
                display: inline-block;
                width: 60px;
                height: 60px;
                background: url("../../assets/close.png") no-repeat center center;
                -webkit-background-size: 20px;
                background-size: 20px;
                position: absolute;
                top: 20px;
                right: 32px;
            }
            .apply_title{
                font-weight: 500;
                text-align: center;
                padding: 40px 0 20px;
            }
            .apply_des{
                color: #292929;
                font-weight: 400;
                text-align: center;
            }
            .selectArea{
                padding: 40px 30px 0;
                .select{
                    width: 450px;
                    height: 56px;
                    padding-left: 15px;
                    border: 1px solid #bbb; /* no */
                    background-color: #fff;
                    border-radius: 8px;
                }
            }
            .apply_btn{
                width: 240px;
                height: 60px;
                margin: 40px auto;
                color: #fff;
                background-color: #ff3f47;
                border-radius: 30px;
                text-align: center;
                line-height: 60px;
                cursor: pointer;
            }
        }
    }
</style>