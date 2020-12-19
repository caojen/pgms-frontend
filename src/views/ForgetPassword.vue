<template>
  <div v-if="show">
    forget-password
  </div>
  <a-spin size="large" v-else/>
</template>

<script>
import * as api from '@/api/user'

export default {
  name: 'ForgetPassword',
  data () {
    return {
      ip: '',
      show: false
    }
  },
  computed: {
    isLogined () {
      return this.$store.getters.isLogined
    }
  },
  async beforeMount () {
    this.show = false
    if (this.isLogined) {
      this.$store.push('/')
    } else {
      await this.$store.dispatch('getCurrentUser')
      if (this.isLogined) {
        this.$store.push('/')
      } else {
        api.getIp()
          .then(res => {
            this.ip = res.data.ip
          })
          .catch(() => {
            this.ip = 'UNKNWON'
          })
          .finally(() => {
            this.show = true
          })
      }
    }
  }
}
</script>
