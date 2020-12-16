<template>
  <div> attend-admin-home </div>
</template>

<script>
export default {
  name: 'AttendAdminHome',
  computed: {
    isLogined () {
      return this.$store.getters.isLogined
    },
    isAttendAdmin () {
      return this.$store.getters.isAttendAdmin
    }
  },
  mounted () {
    if (this.isAttendAdmin === false) {
      this.$router.push('/')
    }
  }
}
</script>
