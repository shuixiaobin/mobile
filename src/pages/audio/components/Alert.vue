<template>
  <transition name="fade">
    <div
      class="alert"
      v-show="visible"
      @click="visible=false"
    >
      <div class="alertWrapper">
        <img
          class="alertImg"
          src="@/assets/alert.png"
        >
        <div class="alertCon">
          <p class="title">打开华图在线app 收听完整内容</p>
          <button @click="goApp">打开app</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { getUrlParam } from '@/utils/utils'
  export default {
    data() {
      return {
        visible: false
      }
    },
    created() {
      this.eventBus.$on('handleShow', () => {
        this.visible = true
      })
    },
    methods: {
      goApp() {
        this.visible = false
        window.location.href = `http://ns.huatu.com/h5/index.html?rid=${getUrlParam('netClassId')}&type=4`
      }
    }
  }
</script>
<style lang='less' scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  .alert {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.55);
    position: fixed;
    left: 0;
    top: 0;
    .alertWrapper {
      position: relative;
      left: 50%;
      top: 50%;
      margin-left: -280px;
      margin-top: -196px;
    }
    .alertImg {
      position: absolute;
      width: 150px;
      height: 192px;
      top: -138px;
      left: 50%;
      margin-left: -280px;
      z-index: 1;
    }
    .alertCon {
      width: 560px;
      height: 292px;
      background: rgba(255, 255, 255, 1);
      border-radius: 16px;
      position: absolute;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      .title {
        margin-top: 60px;
        text-align: center;
        height: 44px;
        font-size: 28px;
        font-weight: 600;
        color: rgba(74, 74, 74, 1);
        line-height: 44px;
      }
      button {
        width: 310px;
        height: 88px;
        background: linear-gradient(270deg, rgba(255, 51, 0, 1) 0%, rgba(255, 63, 71, 1) 100%);
        border-radius: 44px;
        margin-top: 40px;
        font-size: 32px;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        line-height: 88px;
      }
    }
  }
</style>