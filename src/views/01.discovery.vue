<template>
  <div class="discovery-container">
    <!-- 轮播图 -->
    <el-carousel class="" :interval="4000" type="card">
      <el-carousel-item v-for="(item, index) in banners" :key="index">
        <img :src="item.imageUrl" alt="" />
      </el-carousel-item>
    </el-carousel>
    <!-- 推荐歌单 -->
    <div class="recommend">
      <h3 class="title">
        推荐歌单
      </h3>
      <div class="items">
        <div class="item" v-for="(item, index) in list" :key="index">
          <div class="img-wrap">
            <div class="desc-wrap">
              <span class="desc">{{item.copywriter}}</span>
            </div>
            <img :src="item.picUrl" alt="" />
            <span class="iconfont icon-play" @click="toPlaylist(item.id)">▶</span>
          </div>
          <p class="name">{{item.name}}</p>
        </div>
      </div>
    </div>
    <!-- 最新音乐 -->
    <div class="news">
      <h3 class="title">
        最新音乐
      </h3>
      <div class="items">
        <div class="item" v-for="(item, index) in newsongs" :key="index">
          <div class="img-wrap">
            <img :src="item.picUrl" alt="" />
            <span @click="playMusic(item.id)" class="iconfont icon-play">▶</span>
          </div>
          <div class="song-wrap">
            <div class="song-name">{{item.song.name}}</div>
            <div class="singer">{{item.song.artists[0].name}}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 推荐MV -->
    <div class="mvs">
      <h3 class="title">推荐MV</h3>
      <div class="items">
        <div class="item" v-for="(item, index) in mvlist" :key="index">
          <div class="img-wrap" @click="toMv(item.id)">
            <img :src="item.picUrl" alt="" />
            <span class="iconfont icon-play">▶</span>
            <div class="num-wrap">
              <div class="iconfont icon-play">▶</div>
              <div class="num">{{item.playCount}}</div>
            </div>
          </div>
          <div class="info-wrap">
            <div class="name">{{item.name}}</div>
            <div class="singer">{{item.artists[0].name}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'discovery',
  data () {
    return {
      // 轮播图
      banners: [],
      // 推荐歌单
      list: [],
      // 最新音乐
      newsongs: [],
      // 推荐mv
      mvlist: []
    }
  },
  methods: {
    // 播放音乐
    playMusic(id){
      console.log(id)
      axios({
        url: 'https://autumnfish.cn/song/url',
        method: 'get',
        params: {id}
      }).then(res => {
        console.log(JSON.stringify(res))
        // 设置给父组件播放标签的音频请求文件
        this.$parent.musicUrl = res.data.data[0].url
      })
    },
    // 跳转歌单详情页
    toPlaylist(id) {
      this.$router.push(`/playlist?q=${id}`)
    },
    // 跳转 mv 播放页
    toMv(id) {
      this.$router.push(`/mv?id=${id}`)
    }
  },
  created () {
    // 轮播图接口
    axios({
      url: 'https://autumnfish.cn/banner',
      method: 'get',
      params: {type: 0}
    }).then(res => {
      this.banners = res.data.banners
    })

    // 推荐歌单
    axios({
      url: 'https://autumnfish.cn/personalized',
      method: 'get',
      params: {limit: 20}
    }).then(res => {
      this.list = res.data.result
    })

    // 最新音乐
    axios({
      url: 'https://autumnfish.cn/personalized/newsong',
      method: 'get'
    }).then(res => {
      // console.log(res.data)
      this.newsongs = res.data.result
    })

    // 推荐MV
    axios({
      url: 'https://autumnfish.cn/personalized/mv',
      method: 'get'
    }).then(res => {
      console.log(res.data)
      this.mvlist = res.data.result
      for(let i=0; i<this.mvlist.length; i++) {
        if(this.mvlist[i].playCount > 10000) {
          this.mvlist[i].playCount = parseInt(this.mvlist[i].playCount/10000) + '万'
        }
      }
    })
  }
}
</script>

<style >

</style>
