<template>
  <div class="model_test">
    <div class="model">
      <div class="model_title font36">{{model.name}}</div>
      <div class="time font28">{{model.timeInfo}}</div>
      <div class="registered font28"><span class="num">{{model.enrollCount}}</span>人已报名</div>
      <div class="everyTimeWrapper mt20" v-if="model.splitProvince && model.userMeta.positionId === -10 && filterAreaGroupList.length > 0" @click="showAreaGroup(model.areaGroupList)">
        <div class="everyTime">
          <div class="content" v-for="(item, index) in filterAreaGroupList" :key="index">
            <span class="name one-line">{{item.areaList | formateAreaStr}}</span>：
            <span class="time one-line">{{item.timeInfo.slice(5)}}</span>
          </div>
        </div>
        <div class="more">
          <i class="iconfont icon-youjiantou"></i>
        </div>
      </div>
      <div
        class="font24"
        :class="[model.userMeta.status>4?'apply_area_gray':'apply_area']"
        v-if="model.positionFlag !== 1 && model.userMeta && model.userMeta.positionId !== undefined && model.userMeta.positionId !== -10"
        @click="handleClick({flag:true, ...model})"
      ><span class="c4a">{{model.examType === 1 ?'机构性质：':'报考地区：'}}</span> {{model.userMeta.positionName}}</div>
       <div
        class="apply-pos font24"
        :class="{'gray': model.userMeta.status>4}"
        v-if="model.positionFlag === 1 && model.userMeta && model.userMeta.positionId !== undefined && model.userMeta.positionId !== -10"
        @click="handleClick({flag:true, ...model})"
      >
        {{model.userMeta.schoolName ? `${model.userMeta.schoolName} ${model.userMeta.status>4?'':'>'}` : `${model.userMeta.status>4 ? `${model.examType === 1?'机构性质：':'报考地区：'}`:''}${model.userMeta.positionName}`}} <span v-if="!model.userMeta.schoolName && model.userMeta.status<5 ">--请完善职位信息 > </span> 
      </div>
      <div
        :class="['apply_btn','font36',{canApply:btnInfo.flag }]"
        @click="handleClick({flag:false, ...model})"
      >{{btnInfo.text}}</div>
      <div
        class="analyze_liveClass"
        @click="goDetail"
        v-if="subjectId != '14' && model.courseInfo && model.courseInfo.classId"
      > 
        <div class="liveClass" >
            <div class="liveClassInfo">
              <i class="icon">{{model.courseInfo.price ==0 ?"免费":''}}直播解析</i>
              <h3>{{model.courseInfo.courseName}}</h3>  
              <time class="time" v-if="model.courseInfo.liveDate >0">{{gettheDate(model.courseInfo.liveDate)}} 开始</time>
              <time class="time" v-else>{{model.courseInfo.courseTitle}}</time>
            </div>
            <div class="liveClassBtn">
              <span :class="[model.courseInfo.buyFlag > 0?'btnStyle noClick':'btnStyle']">{{model.courseInfo.buyFlag > 0 ? "已经领取":"立即领取"}}</span>
            </div>
        </div>
      </div>
      <div
        class="analyze_liveClass"
        @click="goShenlun"
        v-if="subjectId == '14' && model.courseInfoBo && model.courseInfoBo.classId"
      > 
        <div class="liveClass" >
            <div class="liveClassInfo">
              <i class="icon">{{model.courseInfoBo.price ==0 ?"免费":''}}直播解析</i>
              <h3>{{model.courseInfoBo.courseName}}</h3>   
              <time class="time" v-if="model.courseInfoBo.liveDate >0">{{gettheDate(model.courseInfoBo.liveDate)}} 开始</time>
              <time class="time" v-else>{{model.courseInfoBo.courseTitle}}</time>
            </div>
            <div class="liveClassBtn">
              <span :class="[model.courseInfoBo.buyFlag > 0?'btnStyle noClick':'btnStyle']"> {{model.courseInfoBo.buyFlag > 0 ? "已经领取":"立即领取"}}</span> 
            </div>
        </div>
      </div>
    </div>
    <apply
      :area="areaData"
      :subjectId="subjectId"
      :chooseArea="choosedArea"
      :examType="model.examType"
      :showSelect.sync="showSelect"
      @apply="handleApply"
    ></apply>
    <areaGroup
      v-if="areaGroupFlag"
      :areaGroupFlag="areaGroupFlag"
      :areaGroupData="areaGroupData"
      @closeMore="closeMore"
    />
    <JobInfo 
      v-if="isJobShow"
      :isJobShow.sync="isJobShow" 
      :subjectId="subjectId"
      :examType="model.examType"
      :matchId="model.matchId"
      :paperId="model.userMeta.paperId"
      :schoolInfo="model.userMeta.schoolInfo"
      :positionName="model.userMeta.positionName"
      @refresh="handleRefresh"
    />
  </div>
</template>

<script>
  import apply from './apply'
  import areaGroup from './areaGroup';
  import JobInfo from './JobInfo'
  import { Toast } from 'mint-ui'
  import api from '../../common/api'
  export default {
    name: 'model_test',
    props: ['model', 'isOld', 'subjectId', 'CategoryName', 'SubjectName'],
    components: {
      apply,
      areaGroup,
      JobInfo
    },
    computed: {
      filterAreaGroupList() {
        return this.model.areaGroupList.filter(item => item.timeInfo !== this.model.timeInfo)
      },
      choosedArea() {
        return this.model.userMeta.positionId!==10
          ? this.subjectId == 14
            ? {
              key:this.model.userMeta.positionId,
              value:this.model.userMeta.positionName,
              }
            : {
              key:this.model.userMeta.positionId,
              value:this.model.userMeta.positionName,
              timeInfo: this.model.userMeta.timeInfo,
              paperId: this.model.userMeta.paperId
              }
          : {}
      },
      btnInfo() {
        let flag = false
        let text = ''
        let startTime, endTime
        if (this.subjectId == 14) {
          startTime = this.model.essayStartTime
          endTime = this.model.essayEndTime
        } else {
          startTime = this.model.startTime
          endTime = this.model.endTime
        }
        // startTime = new Date('2019/4/17 09:55').getTime();
        const b5 = startTime - 5 * 60 * 1000 //开考前5分钟
        const a30 = startTime + 30 * 60 * 1000 //开考后30分钟
        if (this.model && this.model.userMeta.positionId !== undefined && this.model.userMeta.positionId !== -10) {
          if (this.time < b5) {
            text = '报名成功,请前往APP参加考试'
          } else if (b5 < this.time && this.time < endTime) {
            if (this.model.userMeta.status === 7) {
              text = '考试结束请前往APP查看报告' //提前交卷
            } else {
              text = '请前往APP开始考试' //开始考试
            }
          } else {
            text = '请前往APP查看报告' //考试结束
          }
        } else {
          if (this.time < a30) {
            text = '我要报名'
            flag = true
          } else {
            text = '停止报名'
          }
        }
        return {
          text,
          flag
        }
      }
    },
    data() {
      return {
        time: new Date().getTime(),
        interval: null,
        showSelect: false,
        isJobShow: false, //关联职位库是否显示
        areaData:[],
        areaGroupFlag:false,
        areaGroupData:[], //多省份数据
        sensorsSureSignUp:null//确认报名埋点数据
      }
    },
    filters: {
      formateAreaStr(arr) {
        let str = arr.reduce((prev, item) => (prev += `${item.value}/`), '')
        return str.substr(0, str.length - 1)
      }
    },
    methods: {
      handleRefresh() {
        this.$emit('refresh')
      },
      // 展示多省数据
      showAreaGroup() {
        this.areaGroupFlag = true
        this.areaGroupData = this.filterAreaGroupList
      },
      gettheDate(date){
        date=new Date(date);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();

        var hour = date.getHours();
            hour=hour < 10 ? `0${hour}` : hour;
        var minute = date.getMinutes();
            minute=minute < 10 ? `0${minute}` : minute;
        var second = date.getSeconds();
        return `${month}月${day}日 ${hour}:${minute}`
      },
      closeMore(){
        this.areaGroupFlag = false
        this.areaGroupData = []
      },
      updateTime() {
        this.interval = setInterval(_ => {
          this.time = new Date().getTime()
        }, 1000)
      },
      handleClick({flag, areaList, status, positionFlag, userMeta}) {
        let startTime;
        if(this.subjectId==14){
            startTime = this.model.essayStartTime;
        }else {
            startTime = this.model.startTime;
        }

        let a30 = startTime+30*60*1000;   //开考后30分钟
        let now = new Date().getTime();
        if(now>=a30){
            Toast({
                message: '考试开始三十分钟后停止报名和修改地区',
                duration: 2000,
                className: 'my_toast'
            })
            return
        }
        if (positionFlag === 1 && userMeta.positionId !== undefined && userMeta.positionId !== -10 && userMeta.status < 5) {
            this.isJobShow = true
            document.getElementsByTagName('body')[0].style.overflow = "hidden"
            return 
        }
        if(!this.btnInfo.flag&&!flag){
          return false
        }else{
          //我要报名埋点
          sensors.track('HuaTuOnline_M_HuaTuOnline_SimulatedSignUp', {
            match_id: this.SubjectName==='申论'?this.model.essayPaperId.toString():this.model.matchId.toString(), //大赛ID
            match_title: this.model.name, //大赛主题
            match_subject: this.SubjectName, //考试科目
            match_class: this.CategoryName, //考试类属
          })
          this.sensorsSureSignUp={
            match_id: this.SubjectName==='申论'?this.model.essayPaperId.toString():this.model.matchId.toString(), //大赛ID
            match_title: this.model.name, //大赛主题
            match_subject: this.SubjectName, //考试科目
            match_class: this.CategoryName, //考试类属
          }
        };
        this.areaData = areaList
        if ((userMeta.status === 1 || userMeta.status === 2 || userMeta.status === 3 || userMeta.status === 4)&&areaList.length > 1) {
          this.showSelect = true;
        }
        if (areaList.length === 1 && userMeta.status === 1 ) {
          this.handleApply( areaList[0] )
        }
      },
      //报名逻辑
      handleApply(obj) {
        if (this.subjectId == 14) {
          this.shenlunApply(obj)
          return
        }
        if (this.isOld) {
          //旧逻辑
          this.oldApply(obj.key)
        } else if (this.isOld === false) {
          //新逻辑
          this.newApply(obj)
        }
      },
      //申论报名
      async shenlunApply({key, value}) {
        try {
          let param = {
            paperId: this.model.essayPaperId,
            positionId: key
          }
          let data = await api.shenlunApply(param).catch(e => {
            console.log(e)
          })
          if (data && data.data.code === 1000000) {
            
            //确认报名埋点
            //console.log(this.sensorsSureSignUp)
            // let sign_up_city=this.areaData.filter(item=>item.key===city)[0].value
            //console.log(sign_up_city)
            sensors.track('HuaTuOnline_M_HuaTuOnline_SimulatedSureSignUp', {
                sign_up_city: value,
                match_id: this.sensorsSureSignUp.match_id, //大赛ID
                match_title: this.sensorsSureSignUp.match_title, //大赛主题
                match_subject: this.sensorsSureSignUp.match_subject, //考试科目
                match_class: this.sensorsSureSignUp.match_class, //考试类属
            })  
            this.showSelect = false
            this.$emit('refresh')
            if (this.model.positionFlag == 1) {
              this.$set(this.model.userMeta, 'positionName', value)
              this.isJobShow = true
              console.log('this.model', this.model);
              document.getElementsByTagName('body')[0].style.overflow = "hidden"
            } else {
              Toast({
                message: '报名成功',
                duration: 2000,
                className: 'my_toast'
              })
            }        
          }
          
        } catch (error) {
          console.log(error);
        }
      },
      //旧版报名
      async oldApply(positionId) {
        let param = {
          positionId,
          paperId: this.model.userMeta.paperId
        }
        let data = await api.oldApply(param).catch(e => {
          console.log(e)
        })
        if (data && data.data.code === 1000000) {
          Toast({
            message: '报名成功',
            duration: 2000,
            className: 'my_toast'
          })
        }
        this.showSelect = false
        this.$emit('refresh')
      },
      async newApply({paperId, key, value}) {
        try {
          let param = {
            matchId: paperId,
            positionId:key
          }
          let data = await api.newApply(param).catch(e => {
            console.log(e)
          })
          if (data && data.data.code === 1000000) {
            //确认报名埋点
            // let sign_up_city=this.areaData.filter(item=>item.key===key)[0].value
            sensors.track('HuaTuOnline_M_HuaTuOnline_SimulatedSureSignUp', {
                sign_up_city: value,
                match_id: this.sensorsSureSignUp.match_id, //大赛ID
                match_title: this.sensorsSureSignUp.match_title, //大赛主题
                match_subject: this.sensorsSureSignUp.match_subject, //考试科目
                match_class: this.sensorsSureSignUp.match_class, //考试类属
            })
            
            this.showSelect = false
            this.$emit('refresh')
            if (this.model.positionFlag == 1) {
              this.$set(this.model.userMeta, 'positionName', value)
              console.log(this.model);
              this.isJobShow = true
              document.getElementsByTagName('body')[0].style.overflow = "hidden"
            } else {
              Toast({
                message: '报名成功',
                duration: 2000,
                className: 'my_toast'
              })
            }
          }
         } catch (e) {
          console.log(e);
        }
      },
      //前往解析课
     async goDetail() {
        let courseId
        if (this.isOld) {
          courseId = this.model.courseId
        } else {
          courseId = this.model.courseInfo ? this.model.courseInfo.classId : ''
        }
         //行测解析课埋点
        sensors.track('HuaTuOnline_M_HuaTuOnline_CourseSignUp', {
          match_class: this.CategoryName, //考试类属
          match_subject: this.SubjectName, //考试科目
          match_id: this.model.matchId.toString(), //大赛ID
          match_title: this.model.name, //大赛主题
          course_id:courseId,//课程id
          course_title:this.model.courseInfo ? this.model.courseInfo.courseName : ''//课程名称
        }) 
        window.location.href = `/cla/class_detail_${courseId}.html`;      
      },
      async goShenlun() {
        let courseId
        if (this.isOld) {
          courseId = this.model.courseId
        } else {
          courseId = this.model.courseInfoBo ? this.model.courseInfoBo.classId : ''
        }
        //解析课埋点       
        sensors.track('HuaTuOnline_M_HuaTuOnline_CourseSignUp', {
          match_class: this.CategoryName, //考试类属
          match_subject: this.SubjectName, //考试科目
          match_id: this.model.essayPaperId.toString(), //大赛ID
          match_title: this.model.name, //大赛主题
          course_id:courseId,//课程id
          course_title:this.model.courseInfoBo ? this.model.courseInfoBo.courseName: ''//课程名称
        })  
        window.location.href = `/cla/class_detail_${courseId}.html`;        
      }
    },
    created() {
      this.updateTime()
    },
    beforeDestroy() {
      //清除定时器
      if (this.interval) window.clearInterval(this.interval)
    }
  }
</script>

<style scoped lang="less">
  .model_test {
    background-color: #fafafa;
    padding: 40px 30px;
    margin-bottom: 10px;
    .model {
      position: relative;
      background-color: #fff;
      border-radius: 16px;
      box-shadow:0px 10px 20px 0px rgba(225,182,182,0.3);
      text-align: center;
      border: 1px solid transparent;
      .model_title {
        padding: 64px 40px 30px;
        color: #000;
        font-weight: 600;
        line-height: 50px;
      }
      .time {
        padding: 0 40px;
        color: #4a4a4a;
        line-height: 40px;
      }
      .registered {
        position: absolute;
        right:0;
        top:0;
        width:250px;
        height:46px;
        background:linear-gradient(270deg,rgba(240,161,159,1) 0%,rgba(238,131,176,1) 100%);
        border-radius:0px 16px 0px 16px;
        color: #fff;
        line-height: 40px;
        .num {
          color: #fff;
        }
      }
      .apply_btn {
        margin: 40px 30px 40px;
        height: 88px;
        background: #f3f3f3;
        -webkit-border-radius: 44px;
        -moz-border-radius: 44px;
        border-radius: 44px;
        color: #9b9b9b;
        font-weight: 600;
        line-height: 88px;
      }
      .canApply {
        position: relative;
        color: #fff;
        background-color: #ff3f47;
      }
      .apply_area {
        margin-bottom: 40px;
        margin-top: 20px;
        color: #ff6d73;
        font-weight: 600;
        box-sizing: border-box;
        padding: 0 10px;
        &:after {
          content: '';
          display: inline-block;
          width: 24px;
          height: 24px;
          background: url('../../assets/bottom.png') no-repeat;
          -webkit-background-size: 24px;
          background-size: 24px;
          position: relative;
          top: 5px;
          left: 10px;
        }
      }
      .c4a {
        color: #4a4a4a;
      }
      .apply_area_gray {
        margin-bottom: 40px;
        margin-top: 20px;
        font-weight: 600;
        box-sizing: border-box;
        padding: 0 10px;
        color: #4a4a4a;
      }
      .apply-pos {
        margin-bottom: 40px;
        margin-top: 20px;
        color: #ff6d73;
        font-weight: 600;
        padding: 0 20px;
        &.gray {
          color: #666;
        }
      }
    }
    .analyze_liveClass{
      padding:20px;
      background:rgba(254,248,242,1);
      border-radius:0px 0px 16px 16px;
      .liveClass{
        display: flex;
        align-content: center;
        justify-content:space-between;
        .liveClassInfo{
          width:496px;
          text-align:left;
          border-right:2px dashed #FFDAB3;
          h3{
            font-size:24px;
            font-weight:normal;
            color:rgba(51,51,51,1);
            line-height:34px;
          }
          .time{
            padding:10px 0 0;
            font-size:20px;
            color:rgba(102,102,102,1);
            line-height:28px;
          }
          .icon{
            font-size:20px;
            color:rgba(184,115,40,1);
          }
        }
        .liveClassBtn{
          display: flex;
          width:134px;
          align-items: center;
          justify-content: center;
          .btnStyle{
            display:block;
            width:112px;
            height:48px;
            border-radius:24px;
            background:#FFF1E3;
            color:#B87328;
            text-align:center;
            font-size:22px;
            line-height:48px;
            &.noClick{
              background:#FFDFC4;
              color:#CC863F;
            }
          }
        }
      }
    }
    .analyze_class {
      height: 40px;
      padding: 24px 170px 24px 30px;
      background-color: #ffeff5;
      color: #ec74a0;
      border-radius: 0 0 16px 16px;
      box-shadow: 0px 10px 20px 0px rgba(225, 182, 182, 0.3);
      position: relative;
      overflow: hidden;
      -ms-text-overflow: ellipsis;
      text-overflow: ellipsis;
      white-space: nowrap;
      .class_title {
        font-weight: 600;
      }
      .class_detail {
        position: absolute;
        right: 30px;
        &:after {
          content: '';
          display: inline-block;
          width: 14px;
          height: 24px;
          background: url('../../assets/right.png') no-repeat;
          -webkit-background-size: 14px auto;
          background-size: 14px auto;
          position: relative;
          top: 3px;
        }
      }
    }
    .everyTimeWrapper {
      margin: 0 auto 20px;
      width: 630px;
      background: rgba(245, 245, 245, 1);
      border-radius: 8px;
      box-sizing: border-box;
      padding: 20px;
      position: relative;
      overflow: hidden;
      max-height: 128px;
      &.mt20 {
        margin-top: 20px;
      }
      .everyTime {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 552px;
        height: auto;
        font-size: 24px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(105, 105, 105, 1);
        line-height: 34px;
        overflow: hidden;
        .content {
          margin-bottom: 10px;
          display: flex;
          align-items: center;
        }
        .name {
          max-width: 135px;
          text-align: left;
          display: inline-block;
        }
        .time{
          flex:1;
          padding: 0
        }
      }
      .more {
        position: absolute;
        transform: translateY(-50%);
        top: 50%;
        right: 10px;
        .iconfont{
          font-size: 36px;
        }
        color: #696969;
      }
    }
  }
</style>