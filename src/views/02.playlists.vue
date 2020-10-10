<template>
  <div class="playlists-container">
    <!-- 同步 -->
    <div class="top-card">
      <div class="icon-wrap">
        <!-- 封面 -->
        <img
          :src="bouList.coverImgUrl"
          alt=""
        >
      </div>
      <div class="content-wrap">
        <div class="tag">
          精品歌单
        </div>
        <div class="title">
          {{ bouList.name }}
        </div>
        <div class="info">
          {{ bouList.description }}
        </div>
      </div>
      <img
        :src="bouList.coverImgUrl"
        alt=""
        class="bg"
      >
      <div class="bg-mask" />
    </div>
    <div class="tab-container">
      <!-- tab栏 顶部 -->
      <div class="tab-bar">
        <span
          class="item"
          :class="{active:selectTag=='全部'}"
          @click="selectTag='全部'"
        >全部</span>
        <span
          class="item"
          :class="{active:selectTag=='欧美'}"
          @click="selectTag='欧美'"
        >欧美</span>
        <span
          class="item"
          :class="{active:selectTag=='华语'}"
          @click="selectTag='华语'"
        >华语</span>
        <span
          class="item"
          :class="{active:selectTag=='流行'}"
          @click="selectTag='流行'"
        >流行</span>
        <span
          class="item"
          :class="{active:selectTag=='说唱'}"
          @click="selectTag='说唱'"
        >说唱</span>
        <span
          class="item"
          :class="{active:selectTag=='摇滚'}"
          @click="selectTag='摇滚'"
        >摇滚</span>
        <span
          class="item"
          :class="{active:selectTag=='民谣'}"
          @click="selectTag='民谣'"
        >民谣</span>
        <span
          class="item"
          :class="{active:selectTag=='电子'}"
          @click="selectTag='电子'"
        >电子</span>
        <span
          class="item"
          :class="{active:selectTag=='轻音乐'}"
          @click="selectTag='轻音乐'"
        >轻音乐</span>
        <span
          class="item"
          :class="{active:selectTag=='影视原声'}"
          @click="selectTag='影视原声'"
        >影视原声</span>
        <span
          class="item"
          :class="{active:selectTag=='ACG'}"
          @click="selectTag='ACG'"
        >ACG</span>
        <span
          class="item"
          :class="{active:selectTag=='怀旧'}"
          @click="selectTag='怀旧'"
        >怀旧</span>
        <span
          class="item"
          :class="{active:selectTag=='治愈'}"
          @click="selectTag='治愈'"
        >治愈</span>
        <span
          class="item"
          :class="{active:selectTag=='旅行'}"
          @click="selectTag='旅行'"
        >旅行</span>
      </div>
      <!-- tab的内容区域 -->
      <div class="tab-content">
        <div class="items">
          <div
            v-for="(item, index) in playlist"
            :key="index"
            class="item"
          >
            <div
              class="img-wrap"
              @click="toPlaylist(item.id)"
            >
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
      </div>
    </div>
    <!-- 分页器
    total 总条数
    current-page 当前页
    page-size 每页显示条数
     -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="page"
      :page-size="30"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Recommend',
  data () {
    return {
      // 总条数
      total: 0,
      // 页码
      page: 1,
      // 精品歌单
      bouList: {},
      // 歌单列表
      playlist: [],
      // 当前选择的歌单类型
      selectTag: '全部'
    }
  },
  watch: {
    selectTag () {
      this.bouListData()
      this.playlistData()
      this.page = 1
    }
  },
  created () {
    this.bouListData()
    this.playlistData()
  },
  methods: {
    // handleCurrentChange事件可以检测当前页
    // handleCurrentChange(val) {
    //   console.log(`当前页: ${val}`)
    // },
    handleCurrentChange (val) {
      this.page = val
      // 重新获取数据
      this.playlistData()
    },
    bouListData () {
      // 精品歌单
      axios({
        url: 'https://autumnfish.cn/top/playlist/highquality',
        method: 'get',
        params: {
          limit: 1,
          cat: this.selectTag
        }
      }).then(res => {
        this.bouList = res.data.playlists[0]
        // console.log(this.bouList)
      })
    },
    playlistData () {
      // 歌单列表
      axios({
        url: 'https://autumnfish.cn/top/playlist/',
        method: 'get',
        params: {
          limit: 30,
          // 起始的值（页码 -1）* limit条数
          offset: (this.page - 1) * 30,
          cat: this.selectTag
        }
      }).then(res => {
        console.log(res.data)
        // 设置分页器总条数
        this.total = res.data.total
        this.playlist = res.data.playlists
        for (let i = 0; i < this.playlist.length; i++) {
          if (this.playlist[i].playCount > 10000) {
            this.playlist[i].playCount = parseInt(this.playlist[i].playCount / 10000) + '万'
          }
        }
      })
    },
    // 跳转到 Playlist 详情页
    toPlaylist (id) {
      this.$router.push(`/playlist?q=${id}`)
    }
  }
}
</script>

<style >

</style>
