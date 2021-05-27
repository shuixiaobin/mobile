<template>
  <div id="app">
    <Cheader @show="handleHeader" :title="title"></Cheader>
    <select-header @change="handleChange" :hideSelect="hideSelect"></select-header>
    <div class="model_list" v-if="modelList&&modelList.length>0">
        <model-test
          v-for="item in modelList"
          :isOld="isOld"
          :subjectId="subjectId"
          :CategoryName='CategoryName'
          :SubjectName='SubjectName'
          :key="item.matchId"
          @refresh="handleRefresh"
          :model="item">
        </model-test>
    </div>
    <div class="no-data" v-else-if="modelList">
      抱歉，目前没有模考
    </div>
    <div class="model_des font28" v-if="modelList&&modelList.length>0" v-html="describe">
        
    </div>
    <down-load></down-load>
  </div>
</template>

<script>
import selectHeader from './select-header'
import ModelTest from './model_test'
import DownLoad from './downLoad'
import Cheader from '../../components/common/c-header'
import api from '../../common/api'
import wxShare from '../../common/share.js'

export default {
  name: 'App',
  components: {
      selectHeader,
      ModelTest,
      DownLoad,
      Cheader
  },
  data(){
      return {
          subjectId: '',
          modelList: null,
          isOld: false,
        //area: null,
          title: '模考大赛',
          hideSelect: 0,
          CategoryName:'',
          SubjectName:''
      }
  },
  computed:{
      describe(){
           let text = this.modelList[0].instruction;
           if(text){
               text=text.replace(/\n/g,'</br>')
           }
           return text;
      }
  },
  created () {
    const categoryId = this.$route.query.categoryId
    const subjectId = this.$route.query.subjectId
    const code = this.$route.query.code
    if (!navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
      if (subjectId == 14) {
        window.location.href = `//v.huatu.com/mock/tiku/shenlun_mock.shtml${code?`?code=${code}`:''}`
      }
      window.location.href = `//v.huatu.com/mock/tiku/xingce_mock.shtml?subjectId=${subjectId}&catgoryId=${categoryId}${code?`&code=${code}`:''}`
    }
  },
  methods: {
      //处理切换学科
      handleChange(id,name){
          wxShare(name);
          this.subjectId = id;
          if(id===14){
            // 申论单独逻辑
            this.getShenlunList();
            //埋点所需考试类型与考试科目
            this.CategoryName=name.category
            this.SubjectName=name.subject
            return;
          }
          this.isOld = false;
           this.getModelTest(id);
          //埋点所需考试类型与考试科目
          this.CategoryName=name.category
          this.SubjectName=name.subject
      },
      //刷新列表
      handleRefresh(){
		  if(this.subjectId===14){
			  // 申论单独逻辑
			  this.getShenlunList();
			  return;
		  }
          if(this.isOld===true){
              this.getOldModelTest()
              return
          }
          this.getModelTest(this.subjectId)
      },
      //获取模考列表（旧逻辑）
      async getOldModelTest(){
          let param = {
              subjectId: this.subjectId
          }
          let data = await api.getOldModelTest(param);
          if(data.data&&data.data.data){
              this.modelList = data.data.data;
          }
      },
      //获取模考列表
      async getModelTest(val){
          let params = {
              page: 1,
              size: 100,
              subjectId: this.subjectId
          }
          const [data,userData ] = await Promise.all([api.getModelTest(params),api.getMockUserList({subjectId: this.subjectId})])
          if(data.data&&data.data.data && userData && userData.data.data){
            const mergeRet = []
            data.data.data.list.forEach(item => {
              userData.data.data.forEach(each => {
                if (item.matchId === each.matchId) {
                  item.userMeta = { ...each }
                  mergeRet.push({
                    ...item
                  })
                }
              });
            })
            console.log(mergeRet);
            this.modelList = mergeRet;
          }
      },
      //获取申论列表
      async getShenlunList(){
          let res = await api.getShenlunMock().catch(e=>{
              console.log(e)
          });
          
          if(res.data&&res.data.data){
            this.modelList = res.data.data.result.map(item => ({
              ...item,
              userMeta: item.userMeta ? { paperId: item.essayPaperId, status: item.status, ...item.userMeta,} : { status:item.status, paperId: item.essayPaperId }
            }))
            console.log(this.modelList);
            // this.modelList = res.data.data.result;
          }
      },
      //判断新旧逻辑
      async isOldFlag(id){
          if(id==14){
              this.isOld=true;
              return;
          }
          let params = {
              subject: id,
              terminal: 7,
          }
          let data = await api.isOldFlag(params)
          if(data&&id===this.subjectId){
              this.isOld = data.data.data.matchOldFlag;
          }
      },
      //获取报名地区
    //   async getArea(){
    //       let data = await api.getArea()
    //       this.area = data.data.data;
    //   },
      //处理头部菜单展示 ---> 如本页筛选头已展示，隐藏处理
      handleHeader(){
          //给一个随机值，在选择器中监听，变化时隐藏选择器
          this.hideSelect = Math.random();
      }
  },
//   created(){
//       this.getArea();
//   }
}
</script>

<style  lang="less">
  @import url('../../less/common');
  #app{
    padding-bottom: 100px;
    .model_list{
      padding-top: 176px;
      background-color: #f3f3f3;
    }
    .no-data{
      padding-top: 500px;
      height: 100px;
      background: url("../../assets/no-data.png") no-repeat center 270px;
      -webkit-background-size: 200px;
      background-size: 200px;
      text-align: center;
      color: #666666;
    }
    .model_des{
      background: #f3f3f3;
      color: #6d7172;
      padding: 30px;
    }
  }
</style>
