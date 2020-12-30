<template>
  <div>
    <a-card :loading="loading" title="我的信息" style="max-width: 60%; min-width: 300px;">
      <p>
        欢迎，{{ info.name }} 老师
      </p>
      <p>
        <span> 联系邮箱: </span>
        <a-input
          placeholder="联系邮箱"
          v-model="email"
          class="info-input-box"
        />
      </p>
      <p>
        <span> 个人主页:</span>
        <a-input
          placeholder="个人主页"
          v-model="personal_page"
          class="info-input-box"
        />
      </p>
      <p>
        <span> 研究领域: </span>
        <a-textarea
          placeholder="研究领域"
          v-model="research_area"
          class="info-input-box"
          rows=8
        />
      </p>
      <p>
        <a-button
          :disabled="!infoChanged"
          style="float: right"
          type="primary"
          :loading="submitting"
          @click="changeInfo"
        >
          更新
        </a-button>
      </p>
    </a-card>
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/camelcase */
import * as api from '@/api/teacher'

export default {
  name: 'TeacherHome',
  data () {
    return {
      loading: true,
      email: '',
      personal_page: '',
      research_area: '',
      submitting: false
    }
  },
  computed: {
    isTeacher () {
      return this.$store.getters.isTeacher
    },
    info () {
      return this.$store.state.teacher.info
    },
    infoChanged () {
      return this.email !== this.info.email ||
        this.personal_page !== this.info.personal_page ||
        this.research_area !== this.info.research_area
    }
  },
  mounted () {
    if (this.isTeacher === false) {
      this.$router.push('/')
    } else {
      this.fetchInfo()
    }
  },
  methods: {
    fetchInfo () {
      this.loading = true
      this.$store.dispatch('getTeacherInfo')
        .then(() => {
          this.loading = false
          this.email = this.info.email
          this.personal_page = this.info.personal_page
          this.research_area = this.info.research_area
        })
    },
    changeInfo () {
      this.submitting = true
      api.updateInfo({
        email: this.email,
        personal_page: this.personal_page,
        research_area: this.research_area
      })
        .then(() => {
          this.$message.success('更新信息成功')
          this.fetchInfo()
          this.submitting = false
        })
    }
  }
}
</script>

<style scoped>
.info-input-box {
  margin: 9px;
  margin-top: 12px;
}
</style>
