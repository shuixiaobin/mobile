<template>
  <div class="Banner">
    <div class="mask"></div>
    <img
      class="classImg"
      :src="classCover||'http://p.htwx.net/images/course_default_500x360.jpg'"
    >
    <img
      class="playIcon"
      :src="playIcon"
      @click="playFn"
    >
    <div
      ref="videoRef"
      id="main"
    ></div>
  </div>
</template>

<script>
  import play from '@/assets/play.png'
  import pause from '@/assets/pause.png'
  export default {
    name: 'Banner',
    props: {
      classCover: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        player: null,
        bgImg: '',
        flag: false,
        playFlag: false
      }
    },
    created() {
      this.eventBus.$on('playFn', val => {
        if (!this.flag) {
          this.flag = true
          this.handlePlay(val.token, val.videoId)
        }
      })
    },
    computed: {
      playIcon() {
        return this.playFlag ? pause : play
      }
    },
    methods: {
      playFn() {
        this.playFlag = !this.playFlag
        if (this.playFlag) {
          this.player && this.player.resume()
        } else {
          this.player && this.player.pause()
        }
      },
      handlePlay(token, id) {
        let that = this
        this.$refs.videoRef.innerHTML = ''
        this.player = new bjcPlayer('#main', {
          token,
          definition: 'hign', // hign 高清 low 低清
          media: 'audio',
          autoplay: false,
          onended: function() {
            that.flag = false
            that.playFlag = false
          },
          onplay: function() {
            that.playFlag = true
          },
          onpause: function() {
            that.playFlag = false
          }
        })
        this.player.play(id)
      }
    },
    destroyed() {
      this.player = null
    }
  }
</script>
<style lang='less' scoped>
  .Banner {
    width: 100%;
    height: 424px;
    background: rgba(0, 0, 0, 0.25);
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    .mask {
      width: 100%;
      height: 100%;
      background: #000;
      position: absolute;
      top: 0;
      left: 0;
    }
    .classImg {
      width: 332px;
      height: 188px;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 16px;
      z-index: 9;
      margin-bottom: 20px;
    }
    .playIcon {
      position: absolute;
      z-index: 10;
      width: 140px;
      height: 140px;
      display: block;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    #main {
      position: absolute;
      height: 424px;
      width: 100%;
      bottom: 0;
    }
  }
</style>