<template>
  <div class="result-container">
    <div class="title-wrap">
      <h2 class="title">
        {{ $route.query.q }}
      </h2>
      <span class="sub-title">找到{{ count }}个结果</span>
    </div>
    <el-tabs v-model="activeIndex">
      <!-- 歌曲搜索结果 -->
      <el-tab-pane
        label="歌曲"
        name="songs"
      >
        <table class="el-table">
          <thead>
            <th />
            <th>音乐标题</th>
            <th>歌手</th>
            <th>专辑</th>
            <th>时长</th>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in searchList"
              :key="index"
              class="el-table__row"
              @dblclick="playMusic(item.id)"
            >
              <td>{{ index+1 }}</td>
              <td>
                <div class="song-wrap">
                  <div class="name-wrap">
                    <span>{{ item.name }}</span>
                    <!-- item.mvid!=0才显示mv跳转 -->
                    <span
                      v-if="item.mvid!=0"
                      class="iconfont icon-mv"
                      @click="toMv(item.mvid)"
                    >mv</span>
                  </div>
                  <span>{{ item.alias[0] }}</span>
                </div>
              </td>
              <td>{{ item.artists[0].name }}</td>
              <td>{{ item.album.name }}</td>
              <td>{{ item.duration }}</td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <!-- 歌单搜索结果页 -->
      <el-tab-pane
        label="歌单"
        name="lists"
      >
        <div class="items">
          <div
            v-for="(item, index) in playLists"
            :key="index"
            class="item"
            @click="toPlaylist(item.id)"
          >
            <div class="img-wrap">
              <div class="num-wrap">
                播放量:
                <span class="num">{{ item.playCount }}</span>
              </div>
              <img
                :src="item.coverImgUrl"
                alt=""
              >
              <span class="iconfont icon-play">▶</span>
            </div>
            <p class="name">
              {{ item.name }}
            </p>
          </div>
        </div>
      </el-tab-pane>
      <!-- MV搜索结果页 -->
      <el-tab-pane
        label="MV"
        name="mv"
      >
        <div class="items mv">
          <div
            v-for="(item, index) in mvLists"
            :key="index"
            class="item"
            @click="toMv(item.id)"
          >
            <div class="img-wrap">
              <img
                :src="item.cover"
                alt=""
              >
              <span class="iconfont icon-play">▶</span>
              <div class="num-wrap">
                <div class="iconfont icon-play">
                  ▶
                </div>
                <div class="num">
                  {{ item.playCount }}
                </div>
              </div>
              <span class="time">{{ item.duration }}</span>
            </div>
            <div class="info-wrap">
              <div class="name">
                {{ item.name }}
              </div>
              <div class="singer">
                {{ item.artistName }}
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Result',
  data () {
    return {
      activeIndex: 'songs',
      // 搜索类型
      type: 1,
      // 搜索结果总数
      count: 0,
      // 保存歌曲搜索结果
      searchList: [],
      // 保存歌单搜索结果
      playLists: [],
      // 保存mv的搜索结果
      mvLists: []
    }
  },
  watch: {
    activeIndex () {
      // songs歌曲
      let type = 1
      let limit = 30
      switch (this.activeIndex) {
        case 'songs':
          type = 1
          limit = 30
          break
        case 'lists':
          type = 1000
          limit = 30
          break
        case 'mv':
          type = 1004
          limit = 12
          break
      }

      axios({
        url: 'https://autumnfish.cn/search',
        method: 'get',
        params: {
          keywords: this.$route.query.q,
          limit,
          type// type:type
        }
      }).then(res => {
        // 获取歌曲
        if (type === 1) {
          // 歌曲的逻辑
          this.searchDone()
        // 获取歌单
        } else if (type === 1000) {
          this.playLists = res.data.result.playlists
          this.count = res.data.result.playlistCount
          // 处理播放次数
          for (let i = 0; i < this.playLists.length; i++) {
            if (this.playLists[i].playCount > 10000) {
              this.playLists[i].playCount = parseInt(this.playLists[i].playCount / 10000) + '万'
            }
          }
        // 获取mv
        } else {
          // 保存mv数据
          this.mvLists = res.data.result.mvs
          this.count = res.data.result.mvCount
          // 处理数据
          for (let i = 0; i < this.mvLists.length; i++) {
            let min = parseInt(this.mvLists[i].duration / 1000 / 60)
            min = min < 10 ? '0' + min : min
            let sec = parseInt(this.mvLists[i].duration / 1000 % 60)
            sec = sec < 10 ? '0' + sec : sec
            // console.log(min + ':' + sec)
            this.mvLists[i].duration = min + ':' + sec
          }
        }
      })
    }
  },
  created () {
    this.searchDone()
  },
  methods: {
    // 搜索歌曲
    searchDone () {
      axios({
        url: 'https://autumnfish.cn/search',
        method: 'get',
        params: {
          keywords: this.$route.query.q,
          limit: 30,
          type: this.type
        }
      }).then(res => {
        this.searchList = res.data.result.songs
        console.log(this.searchList.length)
        // 搜索到的总歌曲数
        this.count = res.data.result.songCount
        // 转换时长显示方式
        for (let i = 0; i < this.searchList.length; i++) {
          // 分钟
          let min = parseInt(this.searchList[i].duration / 1000 / 60)
          min = min < 10 ? '0' + min : min
          // 秒钟
          let sec = parseInt(this.searchList[i].duration / 1000 % 60)
          sec = sec < 10 ? '0' + sec : sec
          // 重新赋值转换后的时间
          this.searchList[i].duration = min + ':' + sec
        }
      })
      this.reload()
    },
    // 播放音乐
    playMusic (id) {
      console.log(id)
      axios({
        url: 'https://autumnfish.cn/song/url',
        method: 'get',
        params: { id }
      }).then(res => {
        console.log(res)
        // 设置给父组件播放标签的音频请求文件
        this.$parent.musicUrl = res.data.data[0].url
      })
    },
    // 去歌单详情页
    toPlaylist (id) {
      this.$router.push(`/playlist?q=${id}`)
    },
    // 去MV播放页
    toMv (id) {
      this.$router.push(`/mv?id=${id}`)
    }
  }
}
</script>

<style >

</style>
