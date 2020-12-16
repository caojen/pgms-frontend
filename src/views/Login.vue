<template>
  <div id="views-login">
    <div id="views-login-body">
      <login-form></login-form>
    </div>
  </div>
</template>

<script>
import LoginForm from './components/LoginForm.vue'
export default {
  components: { LoginForm },
  name: 'Login',
  computed: {
    isLogined () {
      return this.$store.getters.isLogined
    }
  },
  watch: {
    isLogined (newVal) {
      if (newVal) {
        this.$router.push('/redirect')
      }
    }
  }
}
</script>

<style scoped>
#views-login-body {
  width: 100%;
  height: 550px;
}
</style>
