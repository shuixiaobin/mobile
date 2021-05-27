<template>
  <div class="introWrapper">
    <div
      class="introItem"
      v-for="item in teacherList"
      :key="item.teacherId"
    >
      <div class="imgWrapper">
        <img
          class="avatar"
          :src="item.roundPhoto"
          :alt="item.teacherName"
        >
        <div class="imgRight">
          <div class="rate">
            <img
              v-for="(each, index) in Math.round(item.teacherRank)"
              :key="index"
              src="../images/star.png"
            >
            <span class="score">{{item.teacherRank}}分</span>
          </div>
          <div class="title">{{item.SubjectType}}</div>
        </div>
      </div>
      <div class="infor">
        <h3 class="name">{{item.teacherName}}</h3>
        <span class="students">{{item.allStudentNum}}个学生</span>
        <span class="lession">{{item.payClasses}}个在售课程</span>
      </div>
      <p class="desc" v-if="item.Brief">{{item.Brief}}</p>
    </div>

  </div>
</template>

<script>
  export default {
    props: {
      teacherList: {
        type: Array,
        default: () => []
      }
    }
  }
</script>
<style lang='less' scoped>
  .introWrapper {
    .introItem {
      padding: 30px;
      border-top: 10px solid #f3f3f3;
      .imgWrapper {
        display: flex;
        .avatar {
          border-radius: 50%;
          width: 120px;
          height: 120px;
        }
        .imgRight {
          margin-left: 34px;
          .rate {
            img {
              display: inline-block;
              width: 44px;
              height: 44px;
            }
            .score {
              display: inline-block;
              height: 44px;
              font-size: 28px;
              font-weight: 600;
              color: rgba(155, 155, 155, 1);
              line-height: 44px;
            }
          }
        }
      }
      .title {
        height: 40px;
        background: linear-gradient(270deg, rgba(2, 225, 165, 1) 0%, rgba(0, 199, 146, 1) 100%);
        border-radius: 20px;
        font-size: 26px;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        line-height: 40px;
        text-shadow: 0px 0px 2px rgba(2, 137, 101, 0.42);
        text-align: center;
        margin-top: 16px;
      }
      .infor {
        display: inline-flex;
        align-items: center;
        margin-top: 20px;
        .name {
          height: 44px;
          font-size: 36px;
          font-weight: 600;
          color: rgba(74, 74, 74, 1);
          line-height: 44px;
          display: inline-block;
        }
        span {
          height: 44px;
          font-size: 24px;
          font-weight: 400;
          color: rgba(74, 74, 74, 1);
          line-height: 44px;
          margin-left: 46px;
        }
      }
      .desc {
        padding: 20px;
        font-size: 28px;
        font-weight: 400;
        color: rgba(109, 113, 114, 1);
        line-height: 40px;
        position: relative;
        margin-top: 10px;
        background: #f3f3f3;
        &::before {
          content: '';
          width: 0;
          height: 0;
          border-width: 0 10px 10px;
          border-style: solid;
          border-color: transparent transparent #f3f3f3; /*透明 透明  灰*/
          position: absolute;
          left: 45px;
          top: -10px;
        }
      }
    }
  }
</style>