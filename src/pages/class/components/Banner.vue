<template>
  <div class="bannerWrapper">
    <img
      class="banner"
      :src="videoInfo.scaleimg"
      :alt="videoInfo.classTitle"
    >
    <div
      class="timeLimit"
      v-if="timeStr !== ''"
      :class="bgStyle"
      v-html="timeStr"
    ></div>
    <div
      class="shadow"
      v-if="(videoInfo.token&&videoInfo.videoId) || auditionList.length !== 0 "
    >
      <div
        class="classIntro"
        v-if="videoInfo.token&&videoInfo.videoId"
        @click="handlePlayIntro(videoInfo.token,videoInfo.videoId)"
      >
        <span>课程介绍</span>
        <i class="iconfont iconbofang-"></i>
      </div>
      <div
        class="freeLestion mt28"
        @click="handlePlay(auditionList[0])"
        v-if="videoInfo.videoId &&
              videoInfo.token &&
              auditionList.length !== 0"
      >
        免费试听 <i class="iconfont iconGroupCopyx-"></i>
      </div>
      <div
        class="classIntro mt28"
        @click="handlePlay(auditionList[0])"
        v-if="!videoInfo.videoId &&
              !videoInfo.token &&
              auditionList.length !== 0"
      >
        <span>免费试听</span>
        <i class="iconfont iconbofang-"></i>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      videoInfo: {
        type: Object,
        default: () => ({})
      },
      auditionList: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        lastTime: 0,
        timer: null,
        timeStr: '',
        bgStyle: ''
      }
    },
    mounted() {
      if (this.videoInfo.isRushClass || (this.videoInfo.isRushClass && this.videoInfo.isDiscount)) {
        if (this.videoInfo.saleEnd === 0 && this.videoInfo.saleStart > 0) {
          this.countFun(this.videoInfo.saleStart, '剩', '开抢')
          this.bgStyle = 'bg2'
        }
        if (this.videoInfo.saleEnd > 0 && this.videoInfo.saleStart === 0) {
          this.countFun(this.videoInfo.saleEnd, '剩', '停售')
          this.bgStyle = 'bg3'
        }
      } else if (this.videoInfo.isDiscount) {
        if (!this.videoInfo.activityEndTime && Number(this.videoInfo.activityStartTime) > 0) {
          this.countFun(this.videoInfo.activityStartTime, '剩', '恢复原价')
        }
        if (Number(this.videoInfo.activityEndTime) > 0 && !this.videoInfo.activityStartTime) {
          this.countFun(this.videoInfo.activityEndTime, '剩', '恢复原价')
        }
      }
    },
    methods: {
      // 课程介绍
      handlePlayIntro(token, videoId) {
        window.location.href = `http://api.baijiayun.com/m/video/player?vid=${videoId}&token=${token}`
      },
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
      },
      countFun(time, beforeDesc = '', afterDesc = '') {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          // 防止出现负数
          if (time > 1) {
            time -= 1
            const day = Math.floor(time / 3600 / 24)
            let hour = Math.floor((time / 3600) % 24)
            let minute = Math.floor((time / 60) % 60)
            let second = Math.floor(time % 60)
            hour = hour < 10 ? `0${hour}` : hour
            minute = minute < 10 ? `0${minute}` : minute
            second = second < 10 ? `0${second}` : second
            this.lastTime = time
            if (day > 0) {
              this.timeStr = `${beforeDesc} <i>${day}</i> 天 ${afterDesc}`
              if (hour > 0) {
                this.timeStr = `${beforeDesc} <i>${day}</i> 天 <i>${hour}</i> 时 ${afterDesc} `
              }
            } else {
              this.timeStr = `${beforeDesc} <i>${hour}</i> : <i>${minute}</i> : <i>${second}</i> ${afterDesc}`
            }
            if (time > 1) {
              this.countFun(time, beforeDesc, afterDesc)
            }
          } else {
            clearTimeout(this.timer)
            this.lastTime = 0
          }
        }, 1000)
      }
    },
    destroyed() {
      this.timer && clearTimeout(this.timer)
    }
  }
</script>
<style lang='less' scoped>
  .mt28 {
    margin-top: 28px;
  }
  .bannerWrapper {
    position: relative;
    .banner {
      width: 100%;
      height: 424px;
    }
    .shadow {
      width: 100%;
      height: 424px;
      background: rgba(0, 0, 0, 0.6);
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .classIntro {
        width: 238px;
        height: 72px;
        background: #00c792;
        border-radius: 40px;
        opacity: 0.9;
        display: flex;
        align-items: center;
        color: #fff;
        span {
          padding-left: 32px;
        }
        i {
          font-size: 60px;
          margin-left: 30px;
        }
      }
      .freeLestion {
        height: 40px;
        font-size: 28px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 40px;
        .iconGroupCopyx- {
          font-size: 26px;
        }
      }
    }
    .timeLimit {
      background: url('../images/timeBg.png') no-repeat center;
      background-size: 100%;
      height: 54px;
      width: 100%;
      z-index: 99;
      position: absolute;
      left: 0;
      bottom: 0;
      font-size: 24px;
      font-weight: 600;
      line-height: 34px;
      color: #fff;
      text-align: right;
      padding-right: 30px;
      box-sizing: border-box;
      padding-top: 12px;
    }
    .bg2 {
      background: url('../images/timeBg2.png') no-repeat center;
      background-size: 100%;
    }
    .bg3 {
      background: url('../images/timeBg3.png') no-repeat center;
      background-size: 100%;
    }
  }
</style>
<style lang="less">
  .bannerWrapper {
    .timeLimit {
      i {
        font-style: normal;
        display: inline-block;
        padding: 0 5px;
        height: 32px;
        line-height: 32px;
        border-radius: 4px;
        background: #fff;
        color: #00c792;
        text-align: center;
      }
    }
  }
</style>
