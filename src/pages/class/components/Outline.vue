<template>
  <div class="outline">
    <AuditionCell
      v-bind="$attrs"
      v-on="$listeners"
    ></AuditionCell>
    <div class="outlineWrapper">
      <template v-if="outlineData.list&&outlineData.list.length > 0 && outlineData.list[0].type === 0">
        <div
          class="threeLevel"
          v-for="(item, index) in outlineData.list"
          :key="item.id"
        >
          <div
            class="titleWrapper"
            @click="getChild(item.id,item.page,item.isShow,index)"
          >
            <h3 class="one-line title">{{item.title}}</h3>
            <i
              class="iconfont"
              :class="[item.isShow?'iconshanglabeifen':'iconxiala2']"
            ></i>
          </div>
          <div
            class="twoLevelWrapper"
            v-show="item.isShow"
          >
            <div
              class="twoLevel"
              v-for="(each, j) in item.children.list"
              :key="each.id"
            >
              <div
                class="titleWrapper"
                @click="getChild(each.id,each.page,each.isShow,index,j)"
              >
                <h4 class="one-line title">{{each.title}}</h4>
                <i
                  class="iconfont"
                  :class="[each.isShow?'iconshanglabeifen':'iconxiala2']"
                ></i>
              </div>
              <div
                class="onLevel"
                v-show="each.isShow"
              >
                <div
                  class="container"
                  v-for="every in each.children.list"
                  :key="every.id"
                >
                  <span class="num">{{every.serialNumber}}</span>
                  <div class="classDetail">
                    <div class="wrapper">
                      <h5 class="one-line">{{every.title}}</h5><span
                        class="audition"
                        v-show="every.isTrial"
                        @click="handlePlay(every)"
                      >试听</span>
                    </div>
                    <div
                      class="classIntor clearfloat"
                      v-if="every.videoType !== 4"
                    >
                      <span class="classType left">{{every.videoLength}}</span>
                      <span class="teacher right">主讲老师：{{every.teacher}}</span>
                    </div>
                  </div>
                </div>
                <div
                  class="addMore"
                  v-if="each.children.next"
                  @click="addMoreChild(each.id,item.children.list[0].page,index,j)"
                >加载更多</div>
              </div>
            </div>
            <div
              class="addMore"
              v-if="item.children.next"
              @click="addMoreChild(item.id,item.list[0].page,index)"
            >加载更多</div>
          </div>
        </div>
      </template>
      <template v-if="outlineData.list&&outlineData.list.length > 0 && outlineData.list[0].type === 1">
        <div class="twoLevelWrapper">
          <div
            class="twoLevel"
            v-for="(item, index) in outlineData.list"
            :key="item.id"
          >
            <div
              class="titleWrapper"
              @click="getChild(item.id,item.page,item.isShow,index)"
            >
              <h4 class="one-line title">{{item.title}}</h4>
              <i
                class="iconfont"
                :class="[item.isShow?'iconshanglabeifen':'iconxiala2']"
              ></i>
            </div>
            <div
              class="onLevel"
              v-show="item.isShow"
            >
              <div
                class="container"
                v-for="every in item.children.list"
                :key="every.id"
              >
                <span class="num">{{every.serialNumber}}</span>
                <div class="classDetail">
                  <div class="wrapper">
                    <h5 class="one-line">{{every.title}}</h5><span
                      class="audition"
                      v-show="every.isTrial"
                      @click="handlePlay(every)"
                    >试听</span>
                  </div>
                  <div
                    class="classIntor clearfloat"
                    v-if="every.videoType !== 4"
                  >
                    <span class="classType left">{{every.videoLength}}</span>
                    <span class="teacher right">主讲老师：{{every.teacher}}</span>
                  </div>
                </div>
              </div>
              <div
                class="addMore"
                v-if="item.children.next"
                @click="addMoreChild(item.id,item.list[0].page,index)"
              >加载更多</div>
            </div>
          </div>
          <div
            class="addMore"
            v-if="outlineData.next"
            @click="addMore"
          >加载更多</div>
        </div>
      </template>
      <template v-if="outlineData.list&&outlineData.list.length > 0 && outlineData.list[0].type === 2">
        <div class="onLevel">
          <div
            class="container"
            v-for="item in outlineData.list"
            :key="item.id"
          >
            <span class="num">{{item.serialNumber}}</span>
            <div class="classDetail">
              <div class="wrapper">
                <h5 class="one-line">{{item.title}}</h5><span
                  class="audition"
                  v-show="item.isTrial"
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
      </template>
      <div
        class="addMore"
        v-if="outlineData.next"
        @click="addMore"
      >加载更多</div>
      <div
        class="noData"
        v-if="outlineData.list && outlineData.list.length === 0"
      >
        <img
          src="http://p.htwx.net/m/noData.png"
          alt=""
        >
        <p>暂无课程大纲</p>
      </div>
    </div>
  </div>
</template>

<script>
  import Util from '@/common/util'
  import { getOutline } from '@/common/classApi'
  import AuditionCell from './AuditionCell'
  export default {
    data() {
      return {
        classId: Util.getURLQuery('classId'),
        page: 1,
        parentId: 0,
        outlineData: {}
      }
    },
    inheritAttrs: false,
    components: { AuditionCell },
    mounted() {
      this.getParentOutLine()
    },
    methods: {
      // 获取子元素数据
      getChild(parentId, page, isShow, i, j) {
        if (i !== undefined && j !== undefined) {
          this.outlineData.list[i].children.list[j].isShow = !this.outlineData.list[i].children.list[j].isShow
        } else if (i !== undefined && j === undefined) {
          this.outlineData.list[i].isShow = !this.outlineData.list[i].isShow
        }
        if (!isShow) {
          if (i !== undefined && j !== undefined && !this.outlineData.list[i].children.list[j].children.list) {
            getOutline({
              classId: this.classId,
              parentId,
              page
            })
              .then(res => {
                const result = res.data.data
                result.list.forEach(item => {
                  item.isShow = false
                  item.page = 1
                  item.children = {}
                })
                this.outlineData.list[i].children.list[j].children = result
                this.outlineData.list[i].children.list[j].children.next = result.next
              })
              .catch(err => {})
          } else if (i !== undefined && j === undefined && !this.outlineData.list[i].children.list) {
            getOutline({
              classId: this.classId,
              parentId,
              page
            })
              .then(res => {
                const result = res.data.data
                result.list.forEach(item => {
                  item.isShow = false
                  item.page = 1
                  item.children = {}
                })
                this.outlineData.list[i].children = result
                this.outlineData.list[i].children.next = result.next
              })
              .catch(err => {})
          }
        }
      },
      addMoreChild(parentId, page, i, j) {
        let newPage = page + 1
        if (i !== undefined && j !== undefined) {
          getOutline({
            classId: this.classId,
            parentId,
            page: newPage
          })
            .then(res => {
              this.$set(this.outlineData.list[i].children.list[0], 'page', newPage)
              const result = res.data.data
              this.outlineData.list[i].children.list[j].children.list = [...this.outlineData.list[i].children.list[j].children.list, ...result.list]
              this.outlineData.list[i].children.list[j].children.next = result.next
            })
            .catch(err => {})
        } else if (i !== undefined && j === undefined) {
          getOutline({
            classId: this.classId,
            parentId,
            page: newPage
          })
            .then(res => {
              this.$set(this.outlineData.list[0], 'page', newPage)
              const result = res.data.data
              this.outlineData.list[i].children.list = [...this.outlineData.list[i].children.list, ...result.list]
              this.outlineData.list[i].children.next = result.next
            })
            .catch(err => {})
        }
      },
      // 获取最外层大纲
      getParentOutLine() {
        getOutline({
          classId: this.classId,
          parentId: this.parentId,
          page: this.page
        })
          .then(res => {
            const result = res.data.data
            result.list.forEach(item => {
              item.isShow = false
              item.page = 1
              item.children = {}
            })
            if (this.page === 1) {
              this.outlineData = result
            } else {
              this.outlineData.list = [...this.outlineData.list, ...result.list]
            }
            this.outlineData.next = result.next

            if (res.data.data.next) {
              this.page += 1
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      // 最外层加载更多
      addMore() {
        this.getParentOutLine()
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
      }
    }
  }
</script>
<style lang='less' scoped>
  .outlineWrapper {
    padding-top: 20px;
    .titleWrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-left: 30px;
      margin-right: 30px;
      i {
        color: rgba(109, 113, 114, 1);
        transform: scale(0.5);
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
        padding: 10px 0;
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
              margin-left: 10px;
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
    .addMore {
      background: #f3f3f3;
      color: #000;
      width: 192px;
      height: 60px;
      border-radius: 40px;
      font-size: 26px;
      font-weight: 600;
      line-height: 60px;
      text-align: center;
      margin: 20px auto;
    }
    .noData {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 280px 0;
      box-sizing: border-box;
      background: #fff;
      img {
        width: 280px;
        height: 190px;
        display: block;
      }
      p {
        height: 40px;
        font-size: 28px;
        color: #9b9b9b;
        line-height: 40px;
        text-align: center;
        margin-top: 30px;
      }
    }
  }
</style>