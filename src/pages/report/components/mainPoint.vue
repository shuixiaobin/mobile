<template>
  <div class="mainPointBox">
    <div
      class="firstFloor"
      ref="mainPoint"
      v-for="(item,index) in data"
      :key="index"
    >
      <div class="line"></div>
      <div
        class="Level"
        @click="openFirstFloor(item,index)"
      >
        <i :class="item.secondFloorIsShow ? 'icon minus' : 'icon'"></i>
        <h2>{{item.name}}</h2>
        <p>共{{item.qnum}}道题，答对{{item.rnum}}道，正确率{{item.accuracy}}%</p>
      </div>
      <div
        :class="item.secondFloorIsShow ?'secondFloor':'secondFloor hide'"
        v-for="(sfItime,sfIndex) in item.children"
        :key="sfIndex"
      >
        <div
          class="Level"
          @click="opensecondFloor(sfItime,index,sfIndex)"
        >
          <i :class="sfItime.thirdFloorIsShow ? 'icon minus' : 'icon'"></i>
          <h2>{{sfItime.name}}</h2>
          <p>共{{sfItime.qnum}}道题，答对{{sfItime.rnum}}道，正确率{{item.accuracy}}%</p>
        </div>
        <div
          :class="sfItime.thirdFloorIsShow ?'thirdFloor':'thirdFloor hide'"
          v-for="(tfItime,tfIndex) in sfItime.children"
          :key="tfIndex"
        >
          <div class="Level">
            <i class="icon"></i>
            <h2>{{tfItime.name}}</h2>
            <p>共{{tfItime.qnum}}道题，答对{{tfItime.rnum}}道，正确率{{item.accuracy}}%</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {}
    },
    props: {
      data: {
        type: Array,
        default: function() {
          return []
        }
      }
    },
    mounted() {},
    methods: {
      getCorrectRate(item) {
        let number = (item.rnum / item.qnum) * 100
        number = Math.round((number * 100) / 10) / 10
        return number
      },
      openFirstFloor(item, index) {
        item.secondFloorIsShow = !item.secondFloorIsShow
        this.$emit('editSecondPoint', item.secondFloorIsShow, index)
        let lineDom = this.$refs.mainPoint[index].firstChild
        if (item.secondFloorIsShow) {
          let lineHeight = item.children.length * 164
          lineDom.style.height = lineHeight + 'px'
        } else {
          lineDom.style.height = '0px'
        }
      },
      opensecondFloor(item, parentIndex, sonindex) {
        item.thirdFloorIsShow = !item.thirdFloorIsShow
        this.$emit('editThirdPoint', item.thirdFloorIsShow, parentIndex, sonindex)
        let lineDom = this.$refs.mainPoint[parentIndex].firstChild
        let lineParentHeight = this.$refs.mainPoint[parentIndex].offsetHeight
        let lineChirldHeight = item.children.length * 164
        if (item.thirdFloorIsShow) {
          lineDom.style.height = lineParentHeight + lineChirldHeight - 164 + 'px'
        } else {
          lineDom.style.height = lineParentHeight - lineChirldHeight-164 + 'px'
        }
      }
    }
  }
</script>
<style lang="less">
  .mainPointBox {
    .firstFloor {
      position: relative;
      .line {
        width: 1px;
        background: #97e0bd;
        position: absolute;
        left: 34px;
        top: 82px;
        z-index: 2;
      }
      .Level {
        position: relative;
        height: 134px;
        background: #fff;
        padding: 30px 0 0 70px;
        .icon {
          position: absolute;
          left: 20px;
          top: 50%;
          z-index: 1;
          margin-top: -15px;
          width: 30px;
          height: 30px;
          background: url(../../../assets/plusIcon.png) no-repeat center;
          background-size: 30px;
          border-radius: 50%;
          &.minus {
            background: url(../../../assets/minusIcon.png) no-repeat center;
            background-size: 30px;
          }
        }
        h2 {
          font-size: 32px;
          color: #4a4a4a;
          line-height: 44px;
          margin-bottom: 24px;
        }
        p {
          font-size: 24px;
          color: #6c7172;
          line-height: 34px;
        }
      }
      .secondFloor {
        .Level {
          background: rgba(48, 194, 124, 0.04);
          .icon {
            left: 24px;
            margin-top: -11px;
            width: 22px;
            height: 22px;
            background: url(../../../assets/plusIcon02.png) no-repeat center;
            background-size: 22px;
            &.minus {
              background: url(../../../assets/minusIcon.png) no-repeat center;
              background-size: 22px;
            }
          }
        }
      }
      .thirdFloor {
        .Level {
          background: rgba(48, 194, 124, 0.08);
          .icon {
            left: 30px;
            width: 10px;
            height: 10px;
            overflow: hidden;
            margin-top: -5px;
            background: #97e0bd;
          }
        }
      }
    }
  }
</style>