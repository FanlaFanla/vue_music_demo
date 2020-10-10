<template>
  <div class="playlist-container">
    <div class="top-wrap">
      <div class="img-wrap">
        <!-- 封面 -->
        <img
          :src="playlist.coverImgUrl"
          alt=""
        >
      </div>
      <div class="info-wrap">
        <!-- 歌单名 -->
        <p class="title">
          {{ playlist.name }}
        </p>
        <div class="author-wrap">
          <img
            class="avatar"
            :src="playlist.creator.avatarUrl"
            alt=""
          >
          <!-- 创建者 -->
          <span class="name">{{ playlist.creator.nickname }}</span>
          <span class="time">{{ playlist.createTime }} 创建</span>
        </div>
        <div class="play-wrap">
          <span class="iconfont icon-circle-play" />
          <span class="text">播放全部</span>
        </div>
        <div class="tag-wrap">
          <span class="title">标签:</span>
          <ul>
            <li
              v-for="(item, index) in playlist.tags"
              :key="index"
            >
              {{ item }}
            </li>
          </ul>
        </div>
        <div class="desc-wrap">
          <span class="title">简介:</span>
          <span class="desc">{{ playlist.description }}</span>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeIndex">
      <el-tab-pane
        label="歌曲列表"
        name="1"
      >
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
              v-for="(item, index) in playlist.tracks"
              :key="index"
              class="el-table__row"
            >
              <td>{{ index+1 }}</td>
              <td>
                <div class="img-wrap">
                  <img
                    :src="item.al.picUrl"
                    alt=""
                  >
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
                    <span class="iconfont icon-mv" />
                  </div>
                  <span>电视剧加油练习生插曲</span>
                </div>
              </td>
              <td>{{ item.ar[0].name }}</td>
              <td>{{ item.al.name }}</td>
              <td>{{ item.dt }}</td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane
        :label="`评论(${total+hotCount})`"
        name="2"
      >
        <!-- 精彩评论 -->
        <div class="comment-wrap">
          <p class="title">
            精彩评论<span class="number">({{ hotCount }})</span>
          </p>
          <div class="comments-wrap">
            <div
              v-for="(item, index) in hotComments"
              :key="index"
              class="item"
            >
              <div class="icon-wrap">
                <img
                  :src="item.user.avatarUrl"
                  alt=""
                >
              </div>
              <div class="content-wrap">
                <div class="content">
                  <span class="name">{{ item.user.nickname }}</span>
                  <span class="comment">{{ item.content }}</span>
                </div>
                <div
                  v-if="item.beReplied.length!=0"
                  class="re-content"
                >
                  <span class="name">{{ item.beReplied[0].user.nickname }}</span>
                  <span class="comment">{{ item.beReplied[0].content }}</span>
                </div>
                <div class="date">
                  {{ item.time }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 最新评论 -->
        <div class="comment-wrap">
          <p class="title">
            最新评论<span class="number">({{ total }})</span>
          </p>
          <div class="comments-wrap">
            <div
              v-for="(item, index) in comments"
              :key="index"
              class="item"
            >
              <div class="icon-wrap">
                <img
                  :src="item.user.avatarUrl"
                  alt=""
                >
              </div>
              <div class="content-wrap">
                <div class="content">
                  <span class="name">{{ item.user.nickname }}</span>
                  <span class="comment">{{ item.content }}</span>
                </div>
                <div
                  v-if="item.beReplied.length!=0"
                  class="re-content"
                >
                  <span class="name">{{ item.beReplied[0].user.nickname }}</span>
                  <span class="comment">{{ item.beReplied[0].content }}</span>
                </div>
                <div class="date">
                  {{ item.time }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 分页器 -->
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :current-page="page"
          :page-size="20"
          @current-change="handleCurrentChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Playlist',
  data () {
    return {
      activeIndex: '1',
      // 总条数
      total: 0,
      // 页码
      page: 1,
      // 歌单详情数据
      playlist: {},
      // 热门评论
      hotComments: [],
      // 热门评论数
      hotCount: 0,
      // 最新评论
      comments: []
    }
  },
  created () {
    // 获取歌单详情
    axios({
      url: 'https://autumnfish.cn/playlist/detail',
      method: 'get',
      params: {
        id: this.$route.query.q
      }
    }).then(res => {
      this.playlist = res.data.playlist
      for (let i = 0; i < this.playlist.tracks.length; i++) {
        const dt = this.playlist.tracks[i].dt
        // 假定有  320000毫秒
        // 秒 320000/1000 = 320 秒
        // 分 320/60
        // 秒 320%60
        let min = parseInt(dt / 1000 / 60)
        min = min < 10 ? min = '0' + min : min
        let sec = parseInt(dt / 1000 % 60)
        sec = sec < 10 ? sec = '0' + sec : sec
        // 应用格式化后的时间展示形式
        this.playlist.tracks[i].dt = min + ':' + sec
      }
      console.log(res)
    })

    // 获取热门评论
    axios({
      url: 'https://autumnfish.cn/comment/hot',
      method: 'get',
      params: {
        id: this.$route.query.q,
        // 传递类型
        type: 2
      }
    }).then(res => {
      this.hotComments = res.data.hotComments
      this.hotCount = res.data.total
      // console.log(this.hotComments)
    })

    // 获取最新评论
    axios({
      url: 'https://autumnfish.cn/comment/playlist',
      method: 'get',
      params: {
        id: this.$route.query.q
      }
    }).then(res => {
      this.comments = res.data.comments
      this.total = res.data.total
      // console.log(res.data)
    })
  },
  methods: {
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      // 保存页码
      this.page = val

      // 获取最新评论
      axios({
        url: 'https://autumnfish.cn/comment/playlist',
        method: 'get',
        params: {
          id: this.$route.query.q,
          offset: (this.page - 1) * 20
        }
      }).then(res => {
        this.comments = res.data.comments
        this.total = res.data.total
        console.log(res.data)
      })
    },

    // 播放音乐
    playMusic (id) {
      axios({
        url: 'https://autumnfish.cn/song/url',
        method: 'get',
        params: {
          id
        }
      }).then(res => {
        console.log(res)
        this.$parent.musicUrl = res.data.data[0].url
      })
    }
  }
}
</script>

<style >

</style>
