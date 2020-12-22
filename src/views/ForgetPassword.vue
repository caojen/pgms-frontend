<template>
  <div v-if="show">
    <a-alert
      message="Warning"
      description="找回密码的最快方法是直接点击左侧下方的‘联系方式’并直接联系工作人员。本‘找回密码’功能可能会有较大的时间延迟。
        由于无法确定您的登录态，找回密码失败时，系统无法直接告知。因此，当24小时内没有任何进展时，可视为找回密码失败，并且尽快直接联系工作人员修改密码。"
      type="warning"
      show-icon
    />
    <div class="tableLine">
      {{ getIpDescription }}
    </div>
    <div class="tableLine">
      联系邮箱：
      <a-input v-model="email" style="width: 60%"></a-input>
    </div>
    <a-alert
      message="请在下面添加键值对，提供相关信息。例如：学号/工号，登录账号，姓名，证件号码等。提供的信息越详细，成功概率越高。"
      type="info"
      class="tableLine"
    />

    <a-form-model
      ref="dynamicValidateForm"
      :model="dynamicValidateForm"
      class="tableLine"
    >
      <a-form-model-item
        v-for="(domain, index) in dynamicValidateForm.domains"
        :key="index"
        :label="index === 0 ? '必要信息' : ''"
        :rules="{ required: true }"
      >
        <a-input
          v-model="domain.key"
          placeholder="Key"
          style="width: 10%; margin-right: 10px"
        />
        <a-input
          v-model="domain.value"
          placeholder="Value"
          style="width: 47%; margin-right: 10px"
        />
        <a-icon
          v-if="dynamicValidateForm.domains.length"
          class="dynamic-delete-button"
          type="minus-circle-o"
          :disabled="dynamicValidateForm.domains.length === 0"
          @click="removeDomain(domain)"
        />
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="dashed" style="width: 60%" @click="addDomain">
          <a-icon type="plus" /> 添加键值对
        </a-button>
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="primary" html-type="submit" @click="submit()">
          提交信息
        </a-button>
      </a-form-model-item>
    </a-form-model>
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
      show: false,
      email: '',
      dynamicValidateForm: {
        domains: []
      }
    }
  },
  computed: {
    isLogined () {
      return this.$store.getters.isLogined
    },
    getIpDescription () {
      return `当前IP：${this.ip}`
    }
  },
  async beforeMount () {
    this.show = false
    if (this.isLogined) {
      this.$store.push('/')
    } else {
      await this.$store.dispatch('getUserStatus')
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
  },
  methods: {
    addDomain () {
      this.dynamicValidateForm.domains.push({
        key: '',
        value: ''
      })
    },
    removeDomain (domain) {
      const index = this.dynamicValidateForm.domains.indexOf(domain)
      const domains = this.dynamicValidateForm.domains
      domains.splice(index, 1)
      this.$set(this.dynamicValidateForm, 'domains', domains)
    },
    submit () {
      const email = this.email
      if (!email) {
        this.$message.error('请提供您的联系邮箱')
      } else {
        const detail = [
          {
            key: 'email',
            value: email
          },
          ...this.dynamicValidateForm.domains
        ]
        api.forgetPassword(detail)
          .then(() => {
            this.$message.success('找回密码请求已提交成功，请耐心等待工作人员的回复')
            this.email = ''
            this.dynamicValidateForm = {
              domains: []
            }
          })
      }
    }
  }
}
</script>

<style scoped>
.tableLine {
  margin-top: 20px;
  margin-left: 10px;
}
</style>
