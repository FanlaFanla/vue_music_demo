<template>
  <div class="songs-container">
    <div class="tab-bar">
      <span
        class="item"
        :class="{active:tag==0}"
        @click="tag=0"
      >全部</span>
      <span
        class="item"
        :class="{active:tag==7}"
        @click="tag=7"
      >华语</span>
      <span
        class="item"
        :class="{active:tag==96}"
        @click="tag=96"
      >欧美</span>
      <span
        class="item"
        :class="{active:tag==8}"
        @click="tag=8"
      >日本</span>
      <span
        class="item"
        :class="{active:tag==16}"
        @click="tag=16"
      >韩国</span>
    </div>
    <!-- 底部的table -->
    <table class="el-table playlit-table">
      <thead>
        <th />
        <th />
        <th>音乐标题</th>
        <th>歌手</th>
        <th>专辑</th>
        <th>时长</th>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in songsList"
          :key="index"
          class="el-table__row"
        >
          <td>{{ index+1 }}</td>
          <td>
            <div class="img-wrap">
              <img
                :src="item.album.picUrl"
                alt=""
              >
              <!-- 播放按钮 -->
              <span
                class="iconfont icon-play"
                @click="playMusic(item.id)"
              >▶</span>
            </div>
          </td>
          <td>
            <div class="song-wrap">
              <div class="name-wrap">
                <span>{{ item.name }}</span>
                <span
                  v-if="item.mvid != 0"
                  class="iconfont icon-mv"
                  @click="toMv(item.mvid)"
                >mv</span>
              </div>
              <span />
            </div>
          </td>
          <td>{{ item.album.artists[0].name }}</td>
          <td>{{ item.album.name }}</td>
          <td>{{ item.duration }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Songs',
  data () {
    return {
      // 歌曲列表
      songsList: [],
      // 分类
      tag: 0
    }
  },
  watch: {
    tag () {
      this.getList()
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 获取列表数据
    getList () {
      axios({
      url: 'https://autumnfish.cn/top/song',
      method: 'get',
      params: {
        // 传递设置的数据
        type: this.tag
      }
    }).then(res => {
      // console.log(res.data.data)
      this.songsList = res.data.data
      // 处理时长，把毫秒转为 时：分：秒
      for (let i = 0; i < this.songsList.length; i++) {
        // 获取 歌曲毫秒数
        const duration = this.songsList[i].duration
        // 假定有  320000毫秒
        // 秒 320000/1000 = 320 秒
        // 分 320/60
        // 秒 320%60
        let min = parseInt(duration / 1000 / 60)
        min = min < 10 ? min = '0' + min : min
        let sec = parseInt(duration / 1000 % 60)
        sec = sec < 10 ? sec = '0' + sec : sec
        // 应用格式化后的时间展示形式
        this.songsList[i].duration = min + ':' + sec
      }
    })
    },
    // 点击播放音乐
    playMusic (id) {
      axios({
        url: 'https://autumnfish.cn/song/url',
        methos: 'get',
        params: {
          id// id:id
        }
      }).then(res => {
        // 给传递播放地址给父组件
        this.$parent.musicUrl = res.data.data[0].url
      })
    },

    // 跳转到 mv 页面
    toMv (id) {
      this.$router.push(`/mv?id=${id}`)
    }
  }
}
</script>

<style >

</style>
