<template>
  <div class="twoLevel" v-if="auditionList.length > 0">
    <div
      class="titleWrapper"
      @click="isShow=!isShow"
    >
      <h4 class="one-line title">试听单元</h4>
      <i
        class="iconfont"
        :class="[isShow?'iconshanglabeifen':'iconxiala2']"
      ></i>
    </div>
    <div
      class="onLevel"
      v-show="isShow"
    >
      <div
        class="container"
        v-for="item in auditionList"
        :key="item.id"
      >
        <span class="num">{{item.serialNumber}}</span>
        <div class="classDetail">
          <div class="wrapper">
            <h5 class="one-line">{{item.title}}</h5><span
              class="audition"
              @click="handlePlay(item)"
            >试听</span>
          </div>

          <div
            class="classIntor clearfloat"
            v-if="item.videoType !== 4"
          >
            <span class="classType left">{{item.videoLength}}</span>
            <span class="teacher right">主讲老师：{{item.teacher}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      auditionList: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        isShow: false
      }
    },
    methods: {
      // 播放视频
      handlePlay({ token, videoId, videoType, bjyRoomId, bjySessionId }) {
        switch (videoType) {
          case 1:
            window.location.href = `http://api.baijiayun.com/m/video/player?vid=${videoId}&token=${token}`
            break
          case 3:
            if (bjySessionId) {
              window.location.href = `https://www.baijiayun.com/web/playback/index?classid=${bjyRoomId}&session_id=${bjySessionId}&token=${token}`
            } else {
              window.location.href = `https://www.baijiayun.com/web/playback/index?classid=${bjyRoomId}&token=${token}`
            }
            break
          default:
            break
        }
      }
    }
  }
</script>
<style lang='less' scoped>
  .titleWrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: 30px;
    margin-right: 30px;
    i {
      transform: scale(0.5);
      color: rgba(109, 113, 114, 1);
    }
    .title {
      width: 620px;
      height: 88px;
      font-size: 32px;
      font-weight: 400;
      color: rgba(0, 0, 0, 1);
      line-height: 88px;
    }
  }
  .twoLevel {
    box-sizing: border-box;
    .titleWrapper {
      margin-left: 60px;
    }
  }
  .onLevel {
    background: rgba(249, 249, 249, 1);
    padding: 20px 0;
    .container {
      margin-left: 60px;
      display: flex;
      .num {
        display: inline-block;
        width: 34px;
        height: 44px;
        font-size: 32px;
        font-weight: 400;
        color: rgba(0, 0, 0, 1);
        line-height: 44px;
      }
      .classDetail {
        .wrapper {
          display: flex;
          align-items: center;
          h5 {
            max-width: 540px;
            height: 40px;
            font-size: 28px;
            font-weight: 400;
            color: rgba(0, 0, 0, 1);
            line-height: 40px;
          }
          .audition {
            display: inline-block;
            width: 72px;
            height: 40px;
            background: rgba(0, 199, 146, 1);
            border-radius: 4px;
            font-size: 24px;
            font-weight: 600;
            color: rgba(255, 255, 255, 1);
            line-height: 40px;
            text-align: center;
          }
        }
        .classIntor {
          margin-top: 24px;
          height: 34px;
          font-size: 24px;
          font-weight: 400;
          color: rgba(109, 113, 114, 1);
          line-height: 34px;
          .teacher {
            margin-right: 30px;
          }
        }
      }
    }
  }
</style>