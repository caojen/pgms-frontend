<template>
  <div>
    <a-card :loading="loading" title="我的信息" style="max-width: 50%; min-width: 300px;">
      <p>
        欢迎，{{ name }}
      </p>
      <p>
          <span> 学号: {{ studentId }} </span>
      </p>
      <p>
          <span> 联系邮箱: </span>
          <a-input placeholder="联系邮箱" v-model="email" style="margin: 9px; margin-top: 12px"/>
      </p>
      <p>
        <a-button
          :disabled="email === remoteEmail"
          style="float: right"
          type="primary"
          :loading="submitting"
          @click="changeEmail"
        >
          提交
        </a-button>
      </p>
    </a-card>

    <a-card :loading="loading" title="导师信息" style="max-width: 50%; margin-top: 5%; min-width: 300px;">
      <p>
        您的导师：{{ teacher.name || '无记录' }}
      </p>
      <p>
        导师邮箱：{{ teacher.email || '无记录' }}
      </p>
      <p>
        导师个人主页：{{ teacher.personal_page || '无记录' }}
      </p>
      <p>
        研究领域：{{ teacher.research_area || '无记录' }}
      </p>
    </a-card>
  </div>
</template>

<script>
export default {
  name: 'StudentHome',
  data () {
    return {
      loading: true,
      email: '',
      submitting: false
    }
  },
  mounted () {
    if (this.isStudent === false) {
      this.$router.push('/')
    } else {
      this.loading = true
      const getStudentInfo = this.$store.dispatch('getStudentInfo')
      const getTeacherInfo = this.$store.dispatch('getStudentTeacher')
      Promise.all([getStudentInfo, getTeacherInfo])
        .then(() => {
          this.email = this.remoteEmail
          this.loading = false
        })
    }
  },
  computed: {
    name () {
      return this.$store.state.student.info.name
    },
    isStudent () {
      return this.$store.getters.isStudent
    },
    remoteEmail () {
      return this.$store.state.student.info.email
    },
    studentId () {
      return this.$store.state.student.info.sid
    },
    teacher () {
      return this.$store.state.student.teacher
    }
  },
  methods: {
    changeEmail () {
      this.submitting = true
      const email = this.email
      this.$store.dispatch('studentChangeEmail', email)
        .then(() => {
          this.submitting = false
          this.$message.success('邮箱修改成功')
        })
    }
  }
}
</script>
