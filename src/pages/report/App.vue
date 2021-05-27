<template>
  <div class="reportBox">
    <div class="topBox">
      <div class="courseInfo">{{reportData.title}}<br />{{reportData.name}}</div>
      <div class="totalScore" >
        <strong class="fs80">{{reportData.score}}</strong>
        分
        <strong v-if="type != 3">/{{reportData.paper?reportData.paper.score:'0'}}分</strong>
      </div>
      <div class="timeBox" v-if="type != 1">
        <div class="fl">交卷时间：{{getCreateTime(reportData.createTime)}}</div>
        <div class="fr"  v-if="type != 3">答题用时：{{getExpendTime(reportData.expendTime)}}</div>
      </div>
    </div>
    <div class="reportCon">
     
      <!-- 精准估分 -->
      <!--模考大赛 -->
      <!--错题练习 -->

      <ul class="scoreInfo" v-if="type != 1">
        <li>
          <div class="fs24"><strong class="green">{{reportData.rcount}}</strong> 道 / <strong>{{reportData.paper?reportData.paper.qcount:'0'}}</strong> 道</div>答对
        </li>
        <li v-if="type ==2"><strong class="green">{{reportData.cardUserMeta?reportData.cardUserMeta.average:'0'}}</strong> 分<br />全站平均分</li>
        <li v-if="type ==2"><strong class="green">{{reportData.cardUserMeta?reportData.cardUserMeta.beatRate:'0'}}%</strong><br />已击败考生</li>
        
        <li v-if="type ==3"><strong class="green">{{parseInt(reportData.expendTime/60)}}分{{parseInt(reportData.expendTime%60)}}秒</strong><br />用时</li>
      </ul> 
      
      <!-- 模考大赛 -->
      <ul class="scoreInfo" v-if="type == 1 && reportData && reportData.cardUserMeta">
        <li><strong class="green">{{reportData.matchMeta?reportData.matchMeta.positionRank:'0'}}/{{reportData.matchMeta?reportData.matchMeta.positionCount:'0'}}</strong> 分<br />同地区排名</li>
        <li><strong class="green">{{reportData.cardUserMeta?reportData.cardUserMeta.rank:'0'}}/{{reportData.cardUserMeta?reportData.cardUserMeta.total:'0'}}</strong><br />全站排名</li>
        <li><strong class="green">{{reportData.cardUserMeta?reportData.cardUserMeta.maxStr:'0'}}</strong> 分<br />全站最高分</li>
        <li><strong class="green">{{reportData.cardUserMeta?reportData.cardUserMeta.averageStr:'0'}}</strong><br />全站平均分</li>
      </ul>
      <div class="quessummary" v-if="type == 1 && reportData">
            <strong class="title">考试情况
              <i class="line"></i>
            </strong >
            <p class="content" v-if="reportData.answers">共{{reportData.answers.length}}道，答对{{reportData.rcount}}道，未答{{reportData.ucount}}道，共计用时{{parseInt(reportData.expendTime/60)}}分{{parseInt(reportData.expendTime%60)}}秒</p >
      </div> 

      <mainPoint
        :data="reportData.points"
        @editSecondPoint="editSecondPoint"
        @editThirdPoint="editThirdPoint"
      ></mainPoint>
    </div>
    <div
      class="openApp"
      @click="openApp"
    >APP内打开</div>
    <div class="fixedTipsBox" @click="openApp">答题还能赚图币，挑战一下</div>
  </div>
</template>
<script>
  import mainPoint from './components/mainPoint'
  import Util from '@/common/util'
  import { getUrlParam } from '@/utils/utils'
  import { getReport } from '@/common/report'
  import { initWeiXin } from '@/common/shareReport'
  const ua = navigator.userAgent
  export default {
    data() {
      return {
        title: '',
        description: '',
        reportData: {}
      }
    },
    components: {
      mainPoint
    },
    created() {
      this.getReport()
    },
    computed:{
      type(){ //1模考大赛，2精准估分，3练习
        var ary=[12,[3,13,9,7],[2,6]],result;
        ary.map((item,index) =>{
            if(Array.isArray(item)){
              if([...item].findIndex(res=>{
                 return res ==getUrlParam('type');
              }) > -1){
                result= index +1;
              }
            }else{
              if(item == getUrlParam('type')){
                result= index +1;
              }
            }
        })
        return result;
      }
    },
    mounted() {},
    methods: {
      getCreateTime(date) {
        let Data = new Date(date)
        return Util.formatTime(Data).formatData02
      },
      getExpendTime(allSecond) {
        let minute = Util.getMSBySecond(allSecond).minute
        let second = Util.getMSBySecond(allSecond).second
        return minute + '′' + second + '″'
      },
      async getReport() {
        try {
          //let id = '1976de64fc4245f080b22ee58992b047'
          let id = getUrlParam('shareId')
          const { data } = await getReport(id)
          if (data.code == 1000000) {
            this.title = data.data.title
            this.description = data.data.description
            this.reportData = data.data.reportInfo
            //增加显示隐藏
            if (this.reportData.points && this.reportData.points.length > 0) {
              this.reportData.points.forEach(item => {
                if (item.children) {
                  this.$set(item, 'secondFloorIsShow', false)
                  item.children.forEach(itmes => {
                    if (itmes.children) {
                      this.$set(itmes, 'thirdFloorIsShow', false)
                    }
                  })
                }
              })
            }
            //设置tdk
            document.title = this.type == 1 ? "模考报告":'练习报告'
            document
              .querySelector('meta[name="description"]')
              .setAttribute('content', this.description)
            initWeiXin({
              title: data.data.title,
              desc: data.data.description,
              imgUrl: data.data.imgUrl,
              link: window.location.href
            })
          } else {
            this.Toast(data.msg)
          }
        } catch (e) {
          this.Toast(e)
        }
      },
      editSecondPoint(isShow, index) {
        this.reportData.points[index].secondFloorIsShow = isShow
      },
      editThirdPoint(isShow, parentIndex, sonindex) {
        this.reportData.points[parentIndex].children[
          sonindex
        ].secondFloorIsShow = isShow
      },
      openApp() {
        window.location.href = 'http://teacher-api.huatu.com/h5/teacher.html'
      }
    }
  }
</script>
<style lang="less">
  body {
    background: #f9f9f9;
  }
  .reportBox {
    .topBox {
      position: relative;
      height: 300px;
      padding-top: 170px;
      background: linear-gradient(
        46deg,
        rgba(2, 225, 165, 1) 0%,
        rgba(0, 199, 146, 1) 100%
      );
      .courseInfo {
        position: absolute;
        left: 0;
        top: 0;
        // width: 590px;
        padding: 15px 0 0 30px;
        height: 115px;
        // background: url('../../assets/courseInofBg.png') no-repeat left top;
        // background-size: 750px 130px;
        font-size: 28px;
        color: #fff;
        line-height: 45px;
      }
      .totalScore {
        height: 98px;
        line-height: 98px;
        text-align: center;
        font-size: 32px;
        color: #fff;
        text-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        strong {
          font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        }
        .fs80 {
          font-size: 80px;
        }
      }
      .timeBox {
        height: 36px;
        line-height: 36px;
        padding: 40px 30px 0;
        color: rgba(255, 255, 255, 0.73);
        font-size: 26px;
        clear: both;
        overflow: hidden;
        .fl {
          float: left;
        }
        .fr {
          float: right;
        }
      }
    }
    .reportCon {
      position: relative;
      padding-top: 126px;
      padding-bottom: 118px;
      .scoreInfo {
        position: absolute;
        left: 50%;
        top: -86px;
        margin-left: -355px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 710px;
        height: 172px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 8px 20px 0px rgba(150, 92, 128, 0.16);
        border-radius: 16px;
        font-size: 28px;
        li {
          text-align: center;
        }
        strong {
          font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        }
        .fs24 {
          font-size: 24px;
        }
        .green {
          font-size: 36px;
          color: #00c792;
        }
      }
      .quessummary{
            background: rgba(255, 255, 255, 1);
            padding: 20px;
            .title{
               font-size: 36px;
               width: 150px;
               .line{
                 display:block;
                 height: 8px;
                width: 150px;
                margin-top:-10px;
                background-color: #00c792;
               }
            }
            .content{
               font-size: 28px;
               margin-top: 15px;
               font-size: 24px;
            }
      }
    }
    .fixedTipsBox {
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 3;
      width: 100%;
      height: 104px;
      line-height: 104px;
      color: #fff;
      font-size: 36px;
      text-align: center;
      background: rgba(0, 199, 146, 1);
      border-radius: 16px 16px 0px 0px;
    }
  }
</style>