<template>
  <div class="audioPage">
    <Banner :classCover="classCover"></Banner>
    <Outline
      :netClassName="netClassName"
      :list="list"
    ></Outline>
    <div
      class="openApp"
      @click="openApp"
    >APP内打开</div>
    <Alert></Alert>
  </div>
</template>

<script>
  import Banner from './components/Banner'
  import Outline from './components/Outline'
  import Alert from './components/Alert'
  import { initWeiXin } from '@/common/audioShare'
  import { getUrlParam } from '@/utils/utils'
  import { getAudioList } from '@/common/audio'
  const ua = navigator.userAgent.toLowerCase()
  export default {
    data() {
      return {
        classCover: '',
        list: [],
        netClassName: ''
      }
    },
    created() {
      this.getAudioListFn()
      this.eventBus.$on('pullUp', val => {
        this.list = [...this.list, ...val]
      })
      this.eventBus.$on('pullDown', val => {
        this.list = [...val, ...this.list]
      })
    },
    components: { Banner, Outline, Alert },
    methods: {
      // 获取音频大纲数据
      async getAudioListFn() {
        try {
          const { data } = await getAudioList({
            afterNodeId: getUrlParam('afterNodeId'),
            beforeNodeId: getUrlParam('beforeNodeId'),
            cv: getUrlParam('cv'),
            netClassId: getUrlParam('netClassId'), //97854
            shareSyllabusId: getUrlParam('shareSyllabusId'),
            terminal: getUrlParam('terminal')
          })
          if (data.code === 10000) {
            this.classCover = data.data.classCover
            this.list = data.data.list
            this.netClassName = data.data.netClassName
            $('meta[itemprop="name"]').attr('content', data.data.netClassName)
            $('meta[itemprop="image"]').attr('content', data.data.classCover)
            document.title = data.data.netClassName
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
              initWeiXin({
                title: data.data.netClassName,
                desc: '公考速记口诀，汇聚名师智慧，为公考学习保驾护航',
                imgUrl: data.data.classCover,
                link: window.location.href
              })
            }
            // 初始化音频
            if (data.data.list.length > 0) {
              const { token, videoId } = data.data.list[0]
              this.eventBus.$emit('playFn', { token, videoId })
            }
          } else {
            this.Toast(data.msg)
          }
        } catch (error) {
          this.Toast(error)
        }
      },
      openApp() {
        window.location.href = `http://ns.huatu.com/h5/index.html?rid=${getUrlParam('netClassId')}&type=4`
      }
    }
  }
</script>
<style lang='less' scoped>
  .audioPage {
    background: #fff;
    .openApp {
      position: fixed;
      right: 0;
      bottom: 100px;
      width: 202px;
      height: 88px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 0px 26px 0px rgba(255, 109, 115, 0.25);
      border-radius: 200px 0px 0px 200px;
      font-size: 28px;
      font-family: PingFangSC;
      font-weight: 500;
      color: rgba(235, 88, 91, 1);
      line-height: 88px;
      text-align: center;
    }
  }
</style>