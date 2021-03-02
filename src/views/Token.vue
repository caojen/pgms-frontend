<template>
  <div id="views-token-outer">
    <div id="views-token-inner" v-if="showToken">
      <div id="views-token-title" class="item">
        Token
      </div>
      <a-input-password v-model="token" placeholder="使用您的一次性Token进行登录" size="large" style="width: 600px" class="item"/>
      <a-button :disabled="!canClick" type="primary" @click="loginWithToken" style="float: right; margin-right: 30px">
        登录
      </a-button>
    </div>
    <a-spin size="large" v-else/>
  </div>
</template>

<script>
import * as api from '@/api/user/index.ts'
export default {
  name: 'LoginWithToken',
  data () {
    return {
      token: '',
      showToken: false
    }
  },
  computed: {
    isLogined () {
      return this.$store.getters.isLogined
    },
    canClick () {
      return this.token.length >= 100
    }
  },
  watch: {
    isLogined (newVal) {
      if (newVal) {
        this.$router.push('/')
      }
    }
  },
  async beforeMount () {
    // 为了避免token闪动，首先不展示
    this.showToken = false
    if (this.isLogined) {
      this.$router.push('/')
    } else {
      await this.$store.dispatch('getUserStatus')
      if (this.isLogined === false) {
        this.showToken = true
      }
    }
  },
  methods: {
    loginWithToken () {
      api.loginWithToken(this.token)
        .then(() => {
          this.$message.success('登录成功')
          this.$router.push('/')
        })
    }
  }
}
</script>

<style scoped>
#views-token-outer {
  height: 100%;
}
#views-token-inner {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  padding: 3%;
  border: 1px solid black;
  box-shadow: 8px 8px 3px #888888;
}
#views-token-title {
  font-size: 24px;
  color: darkgoldenrod
}
.item {
  margin-bottom: 30px;
}
</style>
