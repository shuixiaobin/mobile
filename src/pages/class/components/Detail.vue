<template>
  <div class="detailWrapper">
    <div class="container">
      <h3 class="title">{{detail.classTitle}}</h3>
      <p class="desc">{{detail.courseIntroduction}}</p>
      <div class="priceWrapper clearfloat">
        <span class="price left">
          <i>¥</i>{{Number(detail.actualPrice) !== 0 ? detail.actualPrice : '免费'}}
        </span>
        <span class="actualPrice left" v-show="detail.actualPrice !== detail.price">¥{{detail.price}}</span>
        <span class="buyCount right">{{detail.buyNum}}人购买</span>
      </div>
      <div
        class="activity"
        @click="viewDetail"
        v-if="detail.activityList&&detail.activityList.length > 0"
      >
        <div class="content">
          <span class="label">活动：</span>
          <span
            v-for="item in detail.activityList"
            :key="item.type"
            class="name"
          >{{item.title}}</span>
        </div>
        <i class="iconfont iconbianzux3"></i>
      </div>
      <ul
        class="classIntro"
        :class="{ all : showAll }"
      >
        <li
          class="classIntroItem"
          v-for="(item, index) in column"
          :key="index"
        >
          <i
            class="iconfont"
            :class="iconArr[item.title]"
          ></i>
          <span>{{item.title}}</span>
          <p class="classDesc">{{item.content}}</p>
        </li>
      </ul>
      <div
        class="switch"
        @click="showAll = !showAll"
      >
        <i
          class="iconfont"
          :class="[showAll ? 'iconshanglabeifen' : 'iconxiala2']"
        ></i>
      </div>
    </div>
    <div
      class="classExt"
      v-html="classExt"
    ></div>
    <div
      class="activityDetail"
      v-if="detail.activityList&&detail.activityList.length > 0"
    >
      <transition name="fade">
        <div
          class="actShade"
          v-show="showActDetail"
          @click="showActDetail = false"
        >
        </div>
      </transition>
      <div
        class="activityWrapper"
        :class="[showActDetail ? 'slideUp' : 'slideDown']"
      >
        <i
          class="iconfont iconCombinedShapex-"
          @click="showActDetail = false"
        />
        <h3 class="actTitle">活动</h3>
        <ul class="activityList">
          <li
            class="item"
            v-for="item in detail.activityList"
            :key="item.type"
          >
            <span class="name">{{item.title}}</span>
            <div
              class="actDesc"
              v-html="item.introduction"
            ></div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      detail: {
        type: Object,
        default: () => ({})
      },
      classExt: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        showAll: false,
        showActDetail: false,
        iconArr: {
          总课时数: 'iconkebiaox1',
          课程时间: 'iconkebiaox1',
          '活动时间：': 'iconbianzu2',
          名师团队: 'iconkebiaox4',
          学习资料: 'iconxuexi-x',
          课程有效期: 'iconkebiaox3',
          不支持: 'iconVIPx',
          增值服务: 'iconfuwux'
        }
      }
    },
    computed: {
      column() {
        return this.detail.columnHeaders.map((item, i) => ({
          title: item,
          content: this.detail.columnDetails[i]
        }))
      }
    },

    methods: {
      // 查看活动详情
      viewDetail() {
        this.showActDetail = true
      }
    }
  }
</script>
<style lang='less' scoped>
  .detailWrapper {
    padding-top: 38px;
    .title {
      font-size: 36px;
      font-weight: 600;
      color: rgba(0, 0, 0, 1);
      line-height: 50px;
      padding: 0 30px;
    }
    .desc {
      margin-top: 38px;
      font-size: 26px;
      font-weight: 400;
      color: rgba(108, 113, 114, 1);
      line-height: 36px;
      padding: 0 30px;
    }
    .priceWrapper {
      margin-top: 48px;
      padding: 0 30px;

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
      .buyCount {
        height: 44px;
        font-size: 26px;
        font-weight: 400;
        color: rgba(155, 155, 155, 1);
        line-height: 44px;
      }
    }
    .classIntro {
      width: 690px;
      padding: 0 30px;
      margin: 14px auto 0;
      box-sizing: border-box;
      background: rgba(249, 249, 249, 1);
      border-radius: 16px 16px 0px 0px;
      border: 2px solid rgba(225, 225, 225, 1);
      border-bottom: none;
      height: auto;
      overflow: hidden;
      height: 240px;
      &.all {
        height: auto;
      }
      .classIntroItem {
        display: flex;
        align-items: flex-start;
        padding: 22px 0;
        border-bottom: 2px solid rgba(225, 225, 225, 1);
        &:last-child {
          border-bottom: none;
        }
        i {
          font-size: 22px;
          line-height: 36px;
          height: 36px;
          color: #9b9b9b;
        }
        span {
          display: inline-block;
          width: 130px;
          height: 36px;
          font-size: 26px;
          font-weight: 600;
          color: rgba(74, 74, 74, 1);
          line-height: 36px;
          margin-left: 20px;
        }
        .classDesc {
          font-size: 26px;
          font-weight: 400;
          color: rgba(74, 74, 74, 1);
          line-height: 36px;
          margin-left: 28px;
          flex: 1
        }
      }
    }
    .switch {
      margin: 0 auto;
      width: 686px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0px 0px 16px 16px;
      background: rgba(249, 249, 249, 1);
      border: 2px solid rgba(225, 225, 225, 1);
      i {
        color: rgba(109, 113, 114, 1);
        transform: scale(0.5);
      }
    }
    .classExt {
      width: 100%;
      margin-top: 30px;
      overflow: hidden;
      padding-bottom: 80px;
      img {
        margin: 0 !important;
        max-width: 100%;
      }
      p {
        font-size: inherit !important;
      }
      span {
        font-size: inherit !important;
      }
    }
    .activity {
      padding: 0 30px;
      margin: 30px 0;
      height: 96px;
      line-height: 96px;
      background: rgba(255, 255, 255, 1);
      border-top: 10px solid #f9f9f9;
      border-bottom: 10px solid #f9f9f9;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .label {
        font-size: 26px;
        font-weight: 400;
        color: rgba(108, 113, 114, 1);
      }

      .iconbianzux3 {
        font-size: 20px;
      }
    }
    .name {
      display: inline-block;
      height: 32px;
      border-radius: 20px;
      border: 2px solid rgba(255, 166, 29, 1);
      padding: 0 10px;
      font-size: 22px;
      font-weight: 400;
      color: rgba(255, 166, 29, 1);
      line-height: 32px;
      margin-left: 10px;
    }
    .activityDetail {
      .actShade {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 100;
        background: rgba(0, 0, 0, 0.5);
      }
      .fade-enter-active,
      .fade-leave-active {
        transition: opacity 0.3s;
      }
      .fade-enter,
      .fade-leave-to {
        opacity: 0;
      }
      .activityWrapper {
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 100;
        background: #fff;
        width: 100%;
        border-radius: 16px 16px 0px 0px;
        padding: 30px 0 50px 0;
        box-sizing: border-box;
        &.slideDown {
          transition: all 0.3s ease;
          transform: translateY(100%);
        }
        &.slideUp {
          transition: all 0.3s ease;
          transform: translateY(0%);
        }
        i {
          color: #c4c4c4;
          position: absolute;
          right: 32px;
          top: 32px;
          font-size: 32px;
        }
        .actTitle {
          margin: 0 auto;
          width: 620px;
          font-size: 36px;
          font-weight: 600;
          line-height: 50px;
          color: #000;
          text-align: center;
        }
        .activityList {
          margin-top: 30px;
          padding: 0 30px;
          .item {
            display: flex;
            align-items: flex-start;
          }
          .actDesc {
            margin-left: 10px;
            flex: 1;
            font-size: 26px;
            font-weight: 400;
            color: rgba(74, 74, 74, 1);
            line-height: 36px;
          }
        }
      }
    }
  }
</style>