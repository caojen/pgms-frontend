<template>
  <div>
    <a-card :loading="loading" title="我的信息" style="max-width: 50%;">
      <p>
        欢迎，{{ name }}
      </p>
      <p>
        管理员ID号: {{ id }}
      </p>
      <p>
        考虑到这个页面是给自己人看的，就没有做这么精细了
      </p>
    </a-card>
  </div>
</template>

<script>
export default {
  name: 'AttendAdminHome',
  data () {
    return {
      loading: true
    }
  },
  computed: {
    isLogined () {
      return this.$store.getters.isLogined
    },
    isAttendAdmin () {
      return this.$store.getters.isAttendAdmin
    },
    name () {
      return this.$store.state.attendAdmin.name
    },
    id () {
      return this.$store.state.attendAdmin.id
    }
  },
  mounted () {
    if (this.isAttendAdmin === false) {
      this.$router.push('/')
    } else {
      if (this.name === '') {
        this.$store.dispatch('getAttendAdminInfo')
          .then(() => {
            this.loading = false
          })
      } else {
        this.loading = false
      }
    }
  }
}
</script>
