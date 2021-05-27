<template>
  <div
    class="classDetail"
    v-if="classDetail.scaleimg"
  >
    <Banner
      :videoInfo="classDetail"
      :auditionList="auditionList"
    ></Banner>
    <div class="tabWrapper">
      <div
        class="tabItem"
        :class="{hov : selected === index}"
        v-for="(item, index) in tabData"
        :key="index"
        @click="handleTab(index)"
      >
        <span class="title">{{item}}</span>
        <div
          class="underline"
          v-show="selected === index"
        ></div>
      </div>
    </div>
    <div class="tabContent">
      <Detail
        v-show="selected === 0"
        :detail="classDetail"
        :classExt="classExt"
      ></Detail>
      <Outline
        v-show="selected === 1"
        :auditionList="auditionList"
      ></Outline>
      <Introduction
        v-if="selected === 2"
        :teacherList="teacherList"
      ></Introduction>
    </div>
    <div class="btnWrapper">
      <button class="priceBtn">
        <span class="price">
          <i>¥</i>{{Number(classDetail.actualPrice)===0?'免费':classDetail.actualPrice}}
        </span>
        <span class="actualPrice" v-show="classDetail.actualPrice !== classDetail.price">¥{{classDetail.price}}</span>
      </button>
      <button
        class="buyBtn"
        @click="openApp"
      >{{classDetail.actualPrice !== 0 ? '立即购买' : '立即报名'}}</button>
    </div>
    <div
      class="openApp"
      @click="openApp"
    >APP内打开</div>
  </div>
</template>

<script>
  import Util from '@/common/util'
  import { classDetail, getClassExt, getTeacherList, getAuditionList } from '@/common/classApi'
  import { initWeiXin } from '@/common/shareReport'
  import Banner from './components/Banner'
  import Detail from './components/Detail'
  import Outline from './components/Outline'
  import Introduction from './components/Introduction'
  export default {
    data() {
      return {
        selected: 0,
        tabData: ['课程详情', '课程大纲', '老师介绍'],
        classDetail: {},
        classExt: '',
        teacherList: [],
        auditionList: [],
        classId: Util.getURLQuery('classId')
      }
    },
    components: { Banner, Detail, Outline, Introduction },
    async mounted() {
      try {
        const ret = await Promise.all([classDetail({ classId: this.classId, collageActivityId: 0 }), getClassExt(this.classId), getAuditionList(this.classId)])
        if (ret[0].data.code === 1000000) {
          this.classDetail = ret[0].data.data
        }
        this.classExt = ret[1].data
        if (ret[2].data.code === 1000000) {
          this.auditionList = ret[2].data.data
        }
        document.querySelector('meta[itemprop="name"]').setAttribute('content', this.classDetail.classTitle)
        initWeiXin({
          title: this.classDetail.classTitle,
          desc: '华图教师直播课程，汇聚名师大咖，为你学习路上保驾护航。',
          imgUrl: 'http://p.htwx.net/htjs.jpeg',
          link: window.location.href
        })
      } catch (error) {
        console.log(error)
      }
    },
    methods: {
      handleTab(i) {
        this.selected = i
        if (this.selected === 2 && this.teacherList.length === 0) {
          getTeacherList(this.classId)
            .then(res => {
              this.teacherList = res.data.data
            })
            .catch(err => {
              console.log(err)
            })
        }
      },
      openApp() {
        window.location.href = `http://teacher-api.huatu.com/h5/teacher.html?type=4&rid=${this.classId}`
      }
    }
  }
</script>
<style lang='less' scoped>
  .classDetail {
    .tabWrapper {
      display: flex;
      padding: 30px 30px 14px 30px;
      border-bottom: 1px solid #e1e1e1;
      .tabItem {
        height: 44px;
        margin-left: 66px;
        position: relative;
        font-size: 32px;
        font-weight: 400;
        color: #4a4a4a;
        line-height: 44px;
        &:first-child {
          margin-left: 0;
        }
        &.hov {
          font-weight: 600;
          color: rgba(0, 0, 0, 1);
        }
      }
      .title {
        position: relative;
        z-index: 1;
      }
      .underline {
        position: absolute;
        bottom: 8px;
        left: 0;
        width: 100%;
        height: 10px;
        background: rgba(0, 199, 146, 1);
        box-shadow: 0px 4px 8px 0px rgba(48, 194, 124, 0.2);
      }
    }
    .btnWrapper {
      width: 100%;
      display: flex;
      position: fixed;
      bottom: 0;
      left: 0;
      button {
        flex: 1;
        height: 90px;
      }
      .priceBtn {
        background: rgba(255, 255, 255, 1);
        border-radius: 16px 0px 0px 0px;
      }
      .buyBtn {
        background: linear-gradient(270deg, rgba(2, 225, 165, 1) 0%, rgba(0, 199, 146, 1) 100%);
        box-shadow: 0px 12px 8px 0px rgba(0, 199, 146, 1);
        border-radius: 0px 16px 0px 0px;
        color: #fff;
        font-size: 32px;
        &.buyBtn2 {
          color: #4a4a4a;
          background: linear-gradient(270deg, rgba(228, 228, 228, 1) 0%, rgba(216, 216, 216, 1) 100%);
          box-shadow: none;
        }
      }
      .price {
        display: inline-flex;
        align-items: flex-end;
        height: 44px;
        font-size: 36px;
        font-weight: 600;
        color: rgba(0, 199, 146, 1);
        line-height: 44px;
        i {
          height: 40px;
          font-size: 28px;
          font-weight: 400;
          line-height: 40px;
          margin-right: 10px;
        }
      }
      .actualPrice {
        height: 44px;
        font-size: 28px;
        font-weight: 600;
        color: rgba(155, 155, 155, 1);
        line-height: 44px;
        margin-left: 20px;
        text-decoration: line-through;
      }
    }
  }
</style>