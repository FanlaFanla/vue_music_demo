<template>
  <div class="mv-container">
    <div class="mv-wrap">
      <h3 class="title">
        mv详情
      </h3>
      <!-- mv -->
      <div class="video-wrap">
        <video
          controls
          :src="mvUrl"
        />
      </div>
      <!-- mv信息 -->
      <div class="info-wrap">
        <div class="singer-info">
          <div class="avatar-wrap">
            <img
              :src="icon"
              alt=""
            >
          </div>
          <span class="name">{{ singer }}</span>
        </div>
        <div class="mv-info">
          <h2 class="title">
            {{ mvDetail.name }}
          </h2>
          <span class="date">发布：{{ mvDetail.publishTime }}</span>
          <span class="number">播放：{{ mvDetail.playCount }}次</span>
          <p class="desc">
            {{ mvDetail.desc }}
          </p>
        </div>
      </div>
      <!-- 精彩评论 -->
      <div class="comment-wrap">
        <p class="title">
          精彩评论<span class="number">{{ hotComments }}</span>
        </p>
        <div class="comments-wrap">
          <div
            v-for="(item, index) in comments.hotComments"
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
                <span class="name">{{ item.user.nickname }}：</span>
                <span class="comment">{{ item.content }}</span>
              </div>
              <div
                v-if="item.beReplied.length != 0"
                class="re-content"
              >
                <span class="name">{{ item.beReplied[0].nickname }}：</span>
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
            v-for="(item, index) in comments.comments"
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
                <span class="name">{{ item.user.nickname }}：</span>
                <span class="comment">{{ item.content }}</span>
              </div>
              <div
                v-if="item.beReplied.length != 0"
                class="re-content"
              >
                <span class="name">{{ item.user.nickname }}：</span>
                <span class="comment">{{ item.content }}</span>
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
        :page-size="limit"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 相关推荐 -->
    <div class="mv-recommend">
      <h3 class="title">
        相关推荐
      </h3>
      <div class="mvs">
        <div class="items">
          <div
            v-for="(item, index) in simiMvs.mvs"
            :key="index"
            class="item"
          >
            <div class="img-wrap">
              <img
                :src="item.cover"
                alt=""
              >
              <span
                class="iconfont icon-play"
                @click="toMv(item.id)"
              >▶</span>
              <div class="num-wrap">
                <div class="iconfont icon-play" />
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
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Mv',
  data () {
    return {
      // 总条数
      total: 20,
      // 页码
      page: 1,
      // 页容量
      limit: 25,
      // mv视频地址
      mvUrl: '',
      // 相关推荐mv
      simiMvs: {},
      // mv 详情
      mvDetail: {},
      // 歌手头像
      icon: '',
      // 歌手名字
      singer: '',
      // 最新评论
      comments: {},
      // 精彩评论条数
      hotComments: 0
    }
  },
  created () {
    // 获取mv播放地址
    axios({
      url: 'https://autumnfish.cn/mv/url',
      method: 'get',
      params: {
        // 传入 mv id
        id: this.$route.query.id
      }
    }).then(res => {
      this.mvUrl = res.data.data.url
      // console.log(res.data)
    })

    // 获取相关推荐mv
    axios({
      url: 'https://autumnfish.cn/simi/mv',
      method: 'get',
      params: {
        mvid: this.$route.query.id
      }
    }).then(res => {
      this.simiMvs = res.data

      // 格式化 播放次数 和 时长
      for (let i = 0; i < this.simiMvs.mvs.length; i++) {
        // 格式化播放次数
        if (this.simiMvs.mvs[i].playCount > 10000) {
          this.simiMvs.mvs[i].playCount = parseInt(this.simiMvs.mvs[i].playCount / 10000) + '万'
        }

        // 格式化时长
        const duration = this.simiMvs.mvs[i].duration
        // 假定有  320000毫秒
        // 秒 320000/1000 = 320 秒
        // 分 320/60
        // 秒 320%60
        let min = parseInt(duration / 1000 / 60)
        min = min < 10 ? min = '0' + min : min
        let sec = parseInt(duration / 1000 % 60)
        sec = sec < 10 ? sec = '0' + sec : sec
        // 应用格式化后的时间展示形式
        this.simiMvs.mvs[i].duration = min + ':' + sec
      }
    })

    // 获取 mv 的信息
    axios({
      url: 'https://autumnfish.cn/mv/detail',
      method: 'get',
      params: {
        mvid: this.$route.query.id
      }
    }).then(res => {
      this.mvDetail = res.data.data
      // console.log(res.data.data)

      // 获取歌手信息
      axios({
        url: 'https://autumnfish.cn/artists',
        method: 'get',
        params: {
          id: this.mvDetail.artists[0].id
        }
      }).then(res => {
        // 歌手封面
        this.icon = res.data.artist.img1v1Url
        // 歌手名
        this.singer = res.data.artist.name
        // console.log(res.data)
      })
    })

    // 获取用户评论
    axios({
      url: 'https://autumnfish.cn/comment/mv',
      method: 'get',
      params: {
        id: this.$route.query.id,
        limit: this.limit
      }
    }).then(res => {
      this.comments = res.data
      this.total = res.data.total
      this.hotComments = res.data.hotComments.length
      // console.log(res.data)
    })
  },
  methods: {
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.page = val
      // 获取用户评论
      axios({
        url: 'https://autumnfish.cn/comment/mv',
        method: 'get',
        params: {
          id: this.$route.query.id,
          limit: this.limit,
          offset: (this.page - 1) * this.limit
        }
      }).then(res => {
        this.comments = res.data
        this.total = res.data.total
        console.log(res.data)
      })
    },
    toMv (id) {
      console.log(id)
      this.$router.push(`/mv?id=${id}`)
      // this.$router.go(0)
      location.reload()
    }
  }
}
</script>

<style></style>
