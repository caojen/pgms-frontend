<template>
  <div></div>
</template>

<script>
export default {
  name: 'Redirect',
  computed: {
    isLogined () {
      return this.$store.getters.isLogined
    },
    isAttendAdmin () {
      return this.$store.getters.isAttendAdmin
    }
  },
  watch: {
    isLogined () {
      this.redirect()
    },
    isAttendAdmin () {
      this.redirect()
    }
  },
  methods: {
    redirect () {
      console.log('logined?', this.isLogined)
      if (!this.isLogined) {
        // 未登录，重定向到登陆界面
        this.$router.push('/login')
      } else {
        // 对用户身份进行判定:
        console.log('is-attend-admin?', this.isAttendAdmin)
        if (this.isAttendAdmin) {
          this.$router.push('/admin/attend')
        }
      }
    }
  },
  mounted () {
    this.redirect()
  }
}
</script>
