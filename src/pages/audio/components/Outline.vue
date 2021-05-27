<template>
  <div class="outline">
    <h3 class="classTit">{{netClassName}}</h3>
    <mt-loadmore
      v-if="list.length>0"
      :top-method="loadTop"
      :bottom-method="loadBottom"
      :bottom-all-loaded="allLoaded"
      ref="loadmore"
    >
      <ul class="outlineWrapper">
        <li
          class="outlineItem"
          v-for="item in list"
          :key="item.id"
          @click="listen(item)"
        >
          <span
            class="num"
            :class="{hov:item.shareNodeTag}"
          >{{item.serialNumber}}</span>
          <div class="rightCon">
            <p
              class="title one-line"
              :class="{hov:item.shareNodeTag}"
            >
              {{item.title}}
            </p>
            <div class="content">
              <span class="time">{{item.videoLength}}</span>
              <span class="teacher">主讲：{{item.teacher}}</span>
            </div>
          </div>
        </li>
      </ul>
    </mt-loadmore>
    <div
      class="nomore"
      v-if="allLoaded"
    >—— 已经到底了 ——</div>
  </div>
</template>

<script>
  import { getAudioList } from '@/common/audio'
  import { getUrlParam } from '@/utils/utils'
  export default {
    props: {
      netClassName: {
        type: String,
        default: ''
      },
      list: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        allLoaded: false
      }
    },
    mounted() {
      // 初始化 loadmore 容器高度
      const outline = document.getElementsByClassName('outline')[0]
      const videoWrap = document.getElementsByClassName('Banner')[0].offsetHeight
      outline.style = `height:${document.documentElement.clientHeight - videoWrap}px`
    },
    methods: {
      listen(item) {
        const { shareNodeTag, token, videoId } = item
        if (shareNodeTag) {
          this.eventBus.$emit('playFn', { token, videoId })
        } else {
          this.eventBus.$emit('handleShow')
        }
      },
      async getAudioListFn({ afterNodeId, beforeNodeId }) {
        try {
          const { data } = await getAudioList({
            afterNodeId,
            beforeNodeId,
            cv: getUrlParam('cv'),
            netClassId: getUrlParam('netClassId'), //97854
            shareSyllabusId: 0,
            terminal: getUrlParam('terminal')
          })
          if (data.code === 10000) {
            const res = data.data.list
            if (res.length === 0) {
              if (afterNodeId) this.allLoaded = true // 上拉禁止 bottomMethod ，若数据已全部获取完毕
              this.Toast('已经没有数据了！')
              return
            }
            // 上拉
            if (afterNodeId) {
              this.eventBus.$emit('pullUp', res)
            }
            // 下拉
            if (beforeNodeId) {
              this.eventBus.$emit('pullDown', res)
            }
          } else {
            this.Toast(data.msg)
          }
        } catch (error) {
          this.Toast(error)
        }
      },
      loadTop() {
        const beforeNodeId = this.list[0].id
        this.getAudioListFn({ beforeNodeId })
        setTimeout(() => this.$refs.loadmore.onTopLoaded(), 800)
      },
      loadBottom() {
        if (this.list.length >= 10) {
          console.log(this.list)
          const afterNodeId = this.list[this.list.length - 1].id
          this.getAudioListFn({ afterNodeId })
        }
        if (this.list.length < 10) {
          this.allLoaded = true // 若数据已全部获取完毕
        }
        setTimeout(() => this.$refs.loadmore.onBottomLoaded(), 800)
      }
    }
  }
</script>
<style lang='less' scoped>
  .outline {
    overflow: auto;
    .mint-loadmore {
      padding: 0 30px;
    }
    .classTit {
      padding: 20px 30px;
      box-sizing: border-box;
      font-size: 28px;
      font-weight: 600;
      color: rgba(0, 0, 0, 1);
      line-height: 40px;
      word-break: break-all;
    }
    .outlineWrapper {
      .outlineItem {
        padding: 20px 0;
        display: flex;
        .num {
          display: inline-block;
          font-size: 32px;
          color: rgba(0, 0, 0, 1);
          line-height: 40px;
          margin-right: 5px;
        }
        .rightCon {
          width: 95%;
        }
        .title {
          height: 40px;
          font-size: 28px;
          color: #000;
          line-height: 40px;
          width: 80%;
        }
        .hov {
          color: #ff3f47;
        }
        .content {
          width: 100%;
          padding-bottom: 20px;
          margin-top: 24px;
          font-size: 24px;
          font-weight: 100;
          color: rgba(0, 0, 0, 1);
          line-height: 34px;
          border-bottom: 2px solid #f3f3f3;
          display: flex;
          justify-content: space-between;
        }
      }
    }
    .nomore {
      text-align: center;
      line-height: 4;
      font-size: 24px;
      color: #000;
      font-weight: 300;
    }
  }
</style>  