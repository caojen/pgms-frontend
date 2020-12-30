<template>
  <div>
    <a-card :loading="loading" title="我的信息" style="max-width: 50%;">
      <p>
        欢迎，{{ name }}
      </p>
    </a-card>
  </div>
</template>

<script>
export default {
  name: 'StudentHome',
  data () {
    return {
      loading: true
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
    }
  }
}
</script>
