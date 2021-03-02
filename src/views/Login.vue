<template>
  <div id="views-login">
    <div id="views-login-body">
      <login-form v-if="showLoginForm"></login-form>
      <a-spin size="large" v-else/>
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
  data () {
    return {
      showLoginForm: false
    }
  },
  async beforeMount () {
    // 当初始化界面前，判断当前是否已经登录了账号
    // 为了避免登录框闪动，首先不展示登录框
    this.showLoginForm = false
    if (this.isLogined) {
      this.$router.push(this.getHomePage())
    } else {
      await this.$store.dispatch('getUserStatus')
      if (this.isLogined === false) {
        this.showLoginForm = true
      }
    }
  },
  watch: {
    isLogined (newVal) {
      if (newVal) {
        this.$router.push(this.getHomePage())
      }
    }
  },
  methods: {
    getHomePage () {
      // 在这里，通过判断用户权限，返回用户的home路径
      if (this.$store.getters.isAttendAdmin) {
        return '/admin/attend'
      } else if (this.$store.getters.isStudent) {
        return '/student'
      } else if (this.$store.getters.isTeacher) {
        return '/teacher'
      } else if (this.$store.getters.isBichoiceAdmin) {
        return '/admin/bichoice'
      } else if (this.$store.getters.isBistudent) {
        return '/bistudent'
      } else {
        return '/404'
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
