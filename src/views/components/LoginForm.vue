<template>
  <div id="views-components-form-login-outer">
    <div id="views-components-form-login-inner">
      <a-form
        id="views-components-form-login"
        :form="form"
        class="login-form"
        @submit="handleSubmit"
        :style="{ width: '400px' }"
      >
        <a-form-item>
          <div id="form-title">
            用户登录
          </div>
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="[
              'username',
              { rules: [{ required: true, message: '请输入用户名！' }] },
            ]"
            placeholder="用户名"
          >
            <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="[
              'password',
              { rules: [{ required: true, message: '请输入密码！' }] },
            ]"
            type="password"
            placeholder="密码"
          >
            <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" class="login-form-button">
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
export default {
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'user_login' })
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          const username = values.username
          const password = values.password
          this.$store.dispatch('login', {
            username,
            password
          })
        }
      })
    }
  }
}
</script>
<style scoped>

#views-components-form-login-outer {
  height: 100%;
}
#views-components-form-login-inner {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  padding: 3%;
  border: 1px solid black;
  box-shadow: 8px 8px 3px #888888;
}
#form-title {
  text-align: center;
  color: darkgoldenrod;
  font-size: 24px;
  font-weight: bolder;
}
#views-components-form-login .login-form {
  max-width: 300px;
}
.login-form-forgot {
  float: right;
}
#views-components-form-login .login-form-button {
  width: 100%;
}
</style>
