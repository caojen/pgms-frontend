<template>
  <div>
    <a-card :loading="loading" title="我的信息" style="max-width: 50%;">
      <p>
        欢迎，{{ name }}
      </p>
      <p>
        管理员ID号: {{ id }}
      </p>
    </a-card>
  </div>
</template>

<script>
export default {
  name: 'BichoiceAdminHome',
  data () {
    return {
      loading: false
    }
  },
  mounted () {
    if (this.isBichoiceAdmin === false) {
      this.$router.push('/')
    } else {
      this.loading = true
      this.$store.dispatch('getBichoiceAdminInfo')
        .finally(() => {
          this.loading = false
        })
    }
  },
  computed: {
    isBichoiceAdmin () {
      return this.$store.getters.isBichoiceAdmin
    },
    name () {
      return this.$store.state.bichoiceAdmin.name
    },
    id () {
      return this.$store.state.bichoiceAdmin.id
    }
  }
}
</script>
