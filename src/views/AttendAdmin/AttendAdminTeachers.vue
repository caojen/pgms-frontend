<template>
  <div>
    <div style="height: 40px">
      <a-row>
        <a-col :span="3" :offset="18">
          <a-button type="primary" icon="reset" @click="handleShowResetAllPassword()">
            重设密码
          </a-button>
          <a-button type="primary" icon="plus" @click="handleShowAddingTeacher()">
            添加老师
          </a-button>
        </a-col>
      </a-row>
    </div>

    <!-- 全部重设密码提示框 -->
    <a-modal
      v-model="showingResetAllPassword"
      title="批量重设密码"
      @ok="resetAllPasswordConfirm"
      @cancel="resetAllPasswordCancel"
      :width=500
    >
      <a-alert type="error" message="你正在批量修改所有老师的密码。请注意，此操作不可撤销" banner />
      <p></p>
      <a-input-password v-model="resetAllPasswordConfirmPass" placeholder="统一新密码"/>
      <p></p>
    </a-modal>
  </div>
</template>

<script>
import * as api from '@/api/attendAdmin'

export default {
  name: 'AttendAdminTeachers',
  data () {
    return {
      showingResetAllPassword: false,
      showingAddingTeacher: false,
      resetAllPasswordConfirmPass: ''
    }
  },
  methods: {
    handleShowResetAllPassword () {
      this.showingResetAllPassword = true
    },
    resetAllPasswordConfirm () {
      api.resetAllPasswordForTeacher(this.resetAllPasswordConfirmPass)
        .then(res => {
          console.log(res)
        })
    },
    resetAllPasswordCancel () {
      this.showingResetAllPassword = false
    }
  }
}
</script>
