<template>
  <div class="job-select">
    <div
      class="input-wrapper"
      :class="{'foucs': isOpen}"
      @click="show"
    >
      <input
        class="inp-text"
        type="text"
        disabled
        :value="value"
        :placeholder="placeholderStr"
      />
      <i
        class="icon"
        :class="{'select-icon': isOpen}"
      ></i>
    </div>
    <div
      class="select-list"
      :class="{visibily: isOpen}"
    >
      <div
        class="max-h"
        :class="{'ani-slide': isOpen}"
      >
        <div
          class="select-item"
          v-for="item in selectData"
          :key="item.value"
          @click.stop="handleSelect(item)"
        >{{item.title}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      placeholderStr: {
        type: String,
        default: '请选择',
      },
      value: {
        type: String,
        default: '',
      },
      selectData: {
        type: Array,
        default: () => [],
      },
      isOpen: {
        type: Boolean,
        default: false,
      },
    },

    methods: {
      show() {
        this.isOpen ? this.$emit('close') : this.$emit('open')
      },
      handleSelect({ title, value }) {
        this.$emit('getNextSelect', { title, value })
      },
    },
  }
</script>
<style lang='less' scoped>
  .job-select {
    position: relative;
    .input-wrapper {
      height: 76px;
      background: #ffffff;
      border-radius: 44px;
      border: 2px solid #e1e1e1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 48px;
      margin-bottom: 28px;
      &.foucs {
        box-shadow: 0px 10px 20px 0px rgba(225, 182, 182, 0.3);
        border: 2px solid #ffeff5;
      }
      .inp-text {
        width: 90%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        font-size: 28px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #4a4a4a;
        line-height: 40px;
        background: #fff;
        
      }
      input[disabled],input:disabled,input.disabled {
        color: #4a4a4a!important;
        -webkit-text-fill-color: #4a4a4a;
        -webkit-opacity: 1;
        opacity: 1;
      }
      .icon {
        width: 22px;
        height: 12px;
        background: url('http://p.htwx.net/wxTk/triangle.png') no-repeat center;
        background-size: 100% 100%;
        &.select-icon {
          background: url('http://p.htwx.net/wxTk/triangle-act.png') no-repeat center;
          background-size: 100% 100%;
        }
      }
    }
    .select-list {
      position: relative;
      z-index: 15;
      width: 100%;
      background: #ffffff;
      box-shadow: 0px 4px 12px 0px rgba(225, 182, 182, 0.3);
      border-radius: 16px;
      border: 2px solid #ffd0e2;
      transition: all 0.1s ease-in;
      visibility: hidden;
      padding: 0;
      margin-bottom: 0;
      box-sizing: border-box;
      &.visibily {
        visibility: visible;
        padding: 20px 0;
        margin-bottom: 28px;
      }
      .max-h {
        overflow-y: auto;
        max-height: 0;
        transition: max-height 0.1s ease-in;
      }
      .ani-slide {
        max-height: 500px;
        transition: max-height 0.2s ease-in;
      }
      &::before {
        content: '';
        position: absolute;
        top: -40px;
        right: 100px;
        width: 0;
        height: 0;
        border: 28px solid transparent;
        border-bottom: 16px solid #fff;
        z-index: 2;
      }
      &::after {
        content: '';
        position: absolute;
        top: -44px;
        right: 100px;
        width: 0;
        height: 0;
        z-index: 1;
        border: 28px solid transparent;
        border-bottom: 16px solid #ffd0e2;
      }
      .select-item {
        display: flex;
        align-items: center;
        line-height: 40px;
        padding: 16px 48px;
        font-size: 28px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #4a4a4a;
        &:hover {
          background: #f5f5f5;
        }
      }
    }
  }
</style>